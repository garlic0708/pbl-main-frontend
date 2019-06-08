import {Inject, Injectable, InjectionToken, Optional} from '@angular/core';
import {AuthenticationDetails, CognitoUser, CognitoUserPool} from 'amazon-cognito-identity-js';
import {environment} from '../environments/environment';
import {WsService} from './ws.service';
import {Observable, Subject} from 'rxjs';
import {switchMap} from 'rxjs/operators';

export interface AuthConfig {
  msId: string;
  username: string;
  projectId: string;
}

export function authConfigFactory(): AuthConfig {
  const url = new URL(window.location.href);
  const msId = url.searchParams.get('msId');
  const username = url.searchParams.get('username');
  const projectId = url.searchParams.get('projectId');
  return {msId, username, projectId};
}

// @ts-ignore
export function authTokenFactory(cognito: CognitoService, @Optional() @Inject(CLIENT_ID) clientId: string): Observable<string> {
  if (clientId) {
    return cognito.getAuthToken();
  }
}

export const AUTH_CONFIG = new InjectionToken<AuthConfig>('auth_config');
export const CLIENT_ID = new InjectionToken<string>('client_id');

@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  private readonly cognitoPool: CognitoUserPool;

  constructor(@Inject(AUTH_CONFIG) private authConfig: AuthConfig,
              @Optional() @Inject(CLIENT_ID) private clientId: string,
              private ws: WsService,) {
    if (clientId) {
      this.cognitoPool = new CognitoUserPool({
        UserPoolId: environment.userPoolId,
        ClientId: clientId,
      });
    }
  }

  getAuthToken(): Observable<string> {
    const {msId, username} = this.authConfig;
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: this.cognitoPool,
    });
    cognitoUser.setAuthenticationFlowType('CUSTOM_AUTH');
    return this.ws.getSessionId()
      .pipe(switchMap(ssId => {
        const result = new Subject<string>();
        cognitoUser.initiateAuth(new AuthenticationDetails({
          Username: username,
        }), {
          customChallenge() {
            cognitoUser.sendCustomChallengeAnswer(JSON.stringify({
              msId, ssId,
            }), this);
          },
          onSuccess: session => {
            result.next(session.getIdToken().getJwtToken());
            result.complete();
          },
          onFailure: err => {
            result.error(err);
            result.complete();
          },
        });
        return result;
      }));
  }

}
