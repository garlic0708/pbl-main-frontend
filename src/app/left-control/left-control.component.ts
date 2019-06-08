import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {WsService} from 'pbl-lib';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {GraphqlService} from 'pbl-lib';
import {Router} from '@angular/router';
import {ProjectService} from '../project.service';
import {RouterEventService} from '../router-event.service';
import {WsMessageService} from '../ws-message.service';
import {map} from 'rxjs/operators';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-left-control',
  templateUrl: './left-control.component.html',
  styleUrls: ['./left-control.component.less']
})
export class LeftControlComponent implements OnInit, OnDestroy {
  @Input() isCollapsed: boolean;

  addProjectVisible = false;
  addingProject = false;
  newProjectName: string;

  // noinspection JSUnusedLocalSymbols
  constructor(
    private graphql: GraphqlService,
    private router: Router,
    private projectService: ProjectService,
    private message: NzMessageService,
    private routerEventService: RouterEventService,
  ) {
  }

  get currentUser(): Observable<any> {
    return this.graphql.getMe();
  }

  get selectedAppId() {
    return this.projectService.selectedAppId;
  }

  setSelectedApp(id) {
    this.router.navigateByUrl(`/${this.selectedProject.id}/${id}`);
  }

  get projects$() {
    return this.projectService.projects$;
  }

  get selectedProject() {
    return this.projectService.selectedProject;
  }

  getAppName(appId) {
    return this.projectService.getApp(appId)
      .pipe(map(app => app.name));
  }

  setSelectedProject(projectId) {
    if (+projectId !== -1) {
      this.router.navigateByUrl(`/${projectId}`);
    } else {
      this.router.navigateByUrl('/');
      this.addProjectVisible = true;
    }
  }

  closeAddProject() {
    this.addProjectVisible = false;
  }

  handleAddProject() {
    this.addingProject = true;
    this.projectService.createProject(this.newProjectName)
      .subscribe(() => {
        this.addingProject = false;
        this.addProjectVisible = false;
        this.message.success(`Successfully created new project: ${this.newProjectName}`);
        this.newProjectName = '';
      });
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  openAddModal() {
  }
}
