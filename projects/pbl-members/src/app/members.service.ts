import {Inject, Injectable} from '@angular/core';
import {GraphqlService, AUTH_CONFIG, AuthConfig, Role} from 'pbl-lib';
import {AddUserToProjectGQL, ChangeRoleGQL, FindUserByUsernameGQL, RemoveUserFromProjectGQL, User} from '../generated/graphql';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  constructor(private graphql: GraphqlService,
              private addUserToProjectGQL: AddUserToProjectGQL,
              private removeUserFromProjectGQL: RemoveUserFromProjectGQL,
              private changeRoleGQL: ChangeRoleGQL,
              private findUserByUsernameGQL: FindUserByUsernameGQL,
              @Inject(AUTH_CONFIG) private authConfig: AuthConfig) {
  }

  addUserToProject(username: string, role: Role): Observable<void> {
    return this.graphql.executeQuery(
      this.addUserToProjectGQL.mutate(
        {projectId: this.authConfig.projectId, username, role})
    );
  }

  removeUserFromProject(username: string): Observable<void> {
    return this.graphql.executeQuery(
      this.removeUserFromProjectGQL.mutate(
        {projectId: this.authConfig.projectId, username})
    );
  }

  changeRole(username: string, role: Role): Observable<void> {
    return this.graphql.executeQuery(
      this.changeRoleGQL.mutate(
        {projectId: this.authConfig.projectId, username, role})
    );
  }

  findUserByUsername(username: string): Observable<User> {
    return this.graphql.executeQuery(
      this.findUserByUsernameGQL.fetch({username})
        .pipe(
          map(({data: {user}}) => user),
          catchError(() => of(null)),
        )
    );
  }

  isSelf(username: string): boolean {
    return username === this.authConfig.username;
  }

}
