import {Inject, Injectable, InjectionToken, Optional} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {HttpLink} from 'apollo-angular-link-http';
import {WebSocketLink} from 'apollo-link-ws';
import {environment} from '../environments/environment';
import {HttpHeaders} from '@angular/common/http';
import {split} from 'apollo-link';
import {getMainDefinition} from 'apollo-utilities';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {AsyncSubject, Observable, of} from 'rxjs';
import {
  NewNotificationGQL,
  PushNotificationGQL,
  Notification,
  GetMyProjectsGQL,
  MeGQL,
  User,
  Project,
  GetProjectDetailGQL, Role, UserRole
} from '../generated/graphql';
import {map, switchMap} from 'rxjs/operators';
import {AUTH_CONFIG, AuthConfig} from './cognito.service';

export const GQL_AUTH_TOKEN = new InjectionToken<Observable<string>>('gql.auth_token');
export const GQL_AUTH_TOKEN_MAIN = new InjectionToken<Observable<string>>('gql.auth_token.main');

export interface ProjectDetail {
  name: string;
  userRoles: UserRole[];
  role: Role;
}

@Injectable({
  providedIn: 'root'
})
export class GraphqlService {

  private init$ = new AsyncSubject();
  private me: User;

  constructor(@Optional() @Inject(GQL_AUTH_TOKEN) private token: Observable<string>,
              @Optional() @Inject(GQL_AUTH_TOKEN_MAIN) private tokenMain: Observable<string>,
              @Inject(AUTH_CONFIG) private authConfig: AuthConfig,
              private apollo: Apollo,
              private httpLink: HttpLink,
              private pushNotificationGQL: PushNotificationGQL,
              private newNotificationGQL: NewNotificationGQL,
              private getMyProjectsGQL: GetMyProjectsGQL,
              private meGQL: MeGQL,
              private getProjectByIdGQL: GetProjectDetailGQL,) {
    if (tokenMain) {
      this.token = tokenMain;
    }

    this.token.subscribe(theToken => {
      console.log('got token: ', theToken);

      // Create an http link:
      const http = httpLink.create({
        uri: `http://${environment.gqlEndpoint}`,
        headers: new HttpHeaders({
          Authorization: `Bearer ${theToken}`,
        }),
      });

      // Create a WebSocket link:
      const ws = new WebSocketLink({
        uri: `ws://${environment.gqlEndpoint}`,
        options: {
          reconnect: true,
          connectionParams: {
            authToken: theToken,
          }
        }
      });

      // using the ability to split links, you can send data to each link
      // depending on what kind of operation is being sent
      const link = split(
        // split based on operation type
        ({query}) => {
          const {kind, operation} = getMainDefinition(query);
          return kind === 'OperationDefinition' && operation === 'subscription';
        },
        ws,
        http,
      );

      apollo.create({
        link,
        cache: new InMemoryCache(),
      });

      this.init$.next(null);
      this.init$.complete();
    });
  }

  pushNotification(receiver: string, content: string): Observable<void> {
    return this.init$.pipe(
      switchMap(() => this.pushNotificationGQL
        .mutate({receiver, content})));
  }

  newNotification(): Observable<Notification> {
    return this.init$.pipe(
      switchMap(() => this.newNotificationGQL.subscribe()),
      map(({data: {newNotification}}) => newNotification)
    );
  }

  executeQuery<T>(query: Observable<T>): Observable<T> {
    return this.init$.pipe(switchMap(() => query));
  }

  getMe(): Observable<User> {
    if (this.me) {
      return of(this.me);
    }
    return this.executeQuery(this.meGQL.fetch())
      .pipe(map(({data: {me}}) => {
        this.me = me;
        return me;
      }));
  }

  getFullProjects(username: string, prev: any[], cursor?: string): Observable<Project[]> {
    return this.getMyProjectsGQL
      .fetch({username, cursor})
      .pipe(
        // @ts-ignore
        switchMap(({data: {findProjectsByUsername: {items, nextCursor}}}) => {
          if (!nextCursor) {
            return of(items);
          }
          return this.getFullProjects(username, prev.concat(items), nextCursor);
        }),
        map(items => prev.concat(items)));
  }

  getMyProjects(): Observable<Project[]> {
    return this.getMe()
      .pipe(switchMap(me => this.getFullProjects(me.username, [])));
  }

  getCurrentProject(): Observable<ProjectDetail> {
    return this.executeQuery(this.getProjectByIdGQL
      .fetch({projectId: this.authConfig.projectId}))
      .pipe(map(({data: {getProjectById}}) => getProjectById));
  }
}
