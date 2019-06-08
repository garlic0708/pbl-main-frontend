import {Component, OnInit} from '@angular/core';
import {GraphqlService, Role, UserRole} from 'pbl-lib';
import {MembersService} from './members.service';
import {Subject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import {User} from '../generated/graphql';

const DEBOUNCE_TIME = 400;

interface ExtendedUserRole extends UserRole {
  removing?: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  members: ExtendedUserRole[] = [];
  isAdmin: boolean;

  private searchUserInput = new Subject<string>();
  searchUserResult: User;

  roles = Object.values(Role);

  constructor(private graphql: GraphqlService,
              private membersService: MembersService,) {
    this.graphql.getCurrentProject()
      .subscribe(detail => {
        this.isAdmin = detail.role !== Role.Member;
        this.members = detail.userRoles;
      });
  }

  addUserToProject(username: string) {
    this.membersService.addUserToProject(username, Role.Member)
      .subscribe(() => {
        this.members.push({
          user: {username},
          role: Role.Member,
        });
      });
  }

  removeUserFromProject(user: ExtendedUserRole) {
    user.removing = true;
    this.membersService.removeUserFromProject(user.user.username)
      .subscribe(() => {
        user.removing = false;
        this.members.splice(
          this.members.indexOf(user), 1);
      });
  }

  changeRole(userRole: UserRole, newRole: Role) {
    if (userRole.role !== newRole) {
      this.membersService.changeRole(userRole.user.username, newRole)
        .subscribe(() => {
          userRole.role = newRole;
        });
    }
  }

  onSearchUserInput(value) {
    this.searchUserInput.next(value);
  }

  ngOnInit(): void {
    this.searchUserInput
      .pipe(
        debounceTime(DEBOUNCE_TIME),
        switchMap(v => this.membersService.findUserByUsername(v))
      )
      .subscribe(u => this.searchUserResult = u);
  }

  isUserMember(username: string): boolean {
    return this.members.some(u => u.user.username === username);
  }

  isSelf(username: string): boolean {
    return this.membersService.isSelf(username);
  }
}
