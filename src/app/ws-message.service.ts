import {Injectable} from '@angular/core';
import {WsService} from 'pbl-lib';
import {MainAuthService} from './main-auth.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export function wsUrlFactory(mainAuth: MainAuthService): Observable<string> {
  return mainAuth.getAccessToken()
    .pipe(map(token => `session_type=main&access_token=${token}`));
}

@Injectable({
  providedIn: 'root'
})
export class WsMessageService {

  constructor(private ws: WsService) {
  }

  getAppName(appId: string): Observable<string> {
    return this.ws.sendOnce({action: 'getClientName', clientId: appId},
      ({clientId}) => clientId === appId,
      'clientName', 'clientNameError')
      .pipe(map(({clientName, clientNameError}) => {
        console.log('got app name', clientName, clientNameError);
        if (clientNameError) {
          throw clientNameError;
        }
        return clientName;
      }));
  }

  isAppTrusted(appId: string): Observable<boolean> {
    return this.ws.sendOnce({action: 'isClientTrusted', clientId: appId},
      ({clientId}) => clientId === appId,
      'isClientTrusted')
      .pipe(map(({isClientTrusted}) => {
        console.log('got isTrusted', isClientTrusted);
        return isClientTrusted;
      }));
  }

  trustApp(appId: string): Observable<void> {
    return this.ws.sendOnce({action: 'trustClient', clientId: appId},
      ({trustedClient}) => trustedClient === appId,);
  }
}
