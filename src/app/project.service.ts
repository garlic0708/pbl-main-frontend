import {Injectable} from '@angular/core';
import {forkJoin, Observable, of, ReplaySubject} from 'rxjs';
import {GraphqlService} from 'pbl-lib';
import {ItemCache} from './item-cache';
import {AddToWorkspaceGQL, CreateProjectGQL, Project} from '../generated/graphql';
import {WsMessageService} from './ws-message.service';
import {map, mapTo, take, tap} from 'rxjs/operators';

export interface App {
  id: string;
  name: string;
  isTrusted: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  projects$ = new ReplaySubject<Project[]>(1);
  private projectCache = new ItemCache();
  private _selectedProjectId: string;

  private appCache = new ItemCache();
  selectedAppId: string;

  constructor(private graphql: GraphqlService,
              private wsMessage: WsMessageService,
              private addToWorkspaceGQL: AddToWorkspaceGQL,
              private createProjectGQL: CreateProjectGQL,) {
    this.graphql.getMyProjects()
      .subscribe(projects => {
        console.log('got projects', projects);
        return this.projects$.next(projects);
      });
    this.projects$.subscribe(items => {
      this.projectCache.clearItems();
      console.log('adding to project cache', items);
      this.projectCache.addToSet(...items);
    });
  }

  get selectedProject(): Project {
    return this.projectCache.getItem(this._selectedProjectId);
  }

  createProject(name: string): Observable<void> {
    return this.graphql.executeQuery(
      this.createProjectGQL.mutate({name})
    ).pipe(map(({data: {createProject}}) => {
      const newProjects = this.projectCache.getList().concat([createProject]);
      this.projects$.next(
        newProjects
      );
      console.log('now projects list: ', newProjects);
    }));
  }

  verifyProject(projectId): Observable<void> {
    return this.projects$.pipe(take(1))
      .pipe(map(() => {
        if (!this.projectCache.isIdInSet(projectId)) {
          throw new Error();
        }
      }));
  }

  navigate(projectId: string, appId: string) {
    console.log('select projectId', projectId);
    // All following logic should wait for projects$ to initialize
    this.projects$.pipe(take(1))
      .subscribe(() => {
        if (!this.projectCache.isIdInSet(projectId)) {
          this._selectedProjectId = null;
          return;
        }
        this._selectedProjectId = projectId;
        if (this.selectedAppId === appId) {
          return;
        }
        const selectedProject = this.selectedProject;
        if (appId && !selectedProject.workspace.includes(appId)) {
          this.graphql.executeQuery(
            this.addToWorkspaceGQL.mutate({projectId, appId})
          ).subscribe(() => {
          });
          selectedProject.workspace.push(appId);
        }
        this.selectedAppId = appId;
      });
  }

  getApp(appId: string): Observable<App> {
    if (!this.appCache.isIdInSet(appId)) {
      console.log('id not in set, putting the observable', appId);
      this.appCache.putObservable(appId,
        forkJoin(
          this.wsMessage.getAppName(appId),
          this.wsMessage.isAppTrusted(appId),
        ).pipe(map(([appName, isAppTrusted]) => {
          console.log('got app info:', appName);
          const app = {
            id: appId,
            name: appName,
            isTrusted: isAppTrusted,
          };
          this.appCache.addToSet(app);
          return app;
        })));
    }
    return this.appCache.getObservable(appId);
  }

  trustApp(appId: string): Observable<void> {
    return forkJoin(
      this.getApp(appId),
      this.wsMessage.trustApp(appId),
    ).pipe(
      map(([app]) => {
        app.isTrusted = true;
      })
    );
  }
}
