import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {AuthService} from 'ng2-ui-auth';

export function authTokenFactory(mainAuth: MainAuthService): Observable<string> {
  return mainAuth.getAccessToken();
}

@Injectable({
  providedIn: 'root'
})
export class MainAuthService {

  constructor(private auth: AuthService,) {
  }

  private accessTokenInit = false;
  private accessToken: string;
  private accessToken$ = new ReplaySubject<string>(1);

  getAccessToken(force = false): Observable<string> {
    if (!this.accessTokenInit || force) {
      this.auth.authenticate('cognito')
        .subscribe(({access_token: accessToken}) => {
          if (this.accessToken !== accessToken) {
            this.accessToken = accessToken;
            this.accessToken$.next(accessToken);
          }
        });
      this.accessTokenInit = true;
    }
    return this.accessToken$.asObservable();
  }
}
