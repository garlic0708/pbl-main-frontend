import {Inject, Injectable, InjectionToken, Optional} from '@angular/core';
import {$WebSocket, WebSocketSendMode} from 'angular2-websocket/angular2-websocket';
import {Observable, of, timer} from 'rxjs';
import {filter, map, share, shareReplay, switchMap, take, tap, timeout} from 'rxjs/operators';
import {AUTH_CONFIG, AuthConfig, CLIENT_ID} from './cognito.service';
import {environment} from '../environments/environment';

export const WS_URL = new InjectionToken<Observable<string>>('ws.url');
export const WS_URL_MAIN = new InjectionToken<Observable<string>>('ws.url.main');

export function wsUrlFactory(
// @ts-ignore
@Optional() @Inject(AUTH_CONFIG) authConfig: AuthConfig, @Optional() @Inject(CLIENT_ID) clientId: string): Observable<string> {
  console.log('got authConfig', authConfig, 'client id is', clientId);
  if (authConfig) {
    return of(`session_type=sub&msId=${authConfig.msId}&clientId=${clientId}`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class WsService {
  private ws$: Observable<$WebSocket>;
  private sessionId$: Observable<string>;

  constructor(@Optional() @Inject(WS_URL) private wsUrl: Observable<string>,
              @Optional() @Inject(WS_URL_MAIN) private wsUrlMain: Observable<string>,) {
    if (wsUrlMain) {
      this.wsUrl = wsUrlMain;
    }
  }

  static getDataStreamFromWs(ws: $WebSocket): Observable<any> {
    const parseJson = msg => JSON.parse(msg.data);
    return ws.getDataStream().pipe(
      map(parseJson));
  }

  getWs(): Observable<$WebSocket> {
    if (!this.ws$) {
      this.ws$ = this.wsUrl
        .pipe(
          map(url => {
            const ws = new $WebSocket(
              `${environment.wsEndpoint}?${url}`);
            ws.setSend4Mode(WebSocketSendMode.Direct);

            // Send a keepalive message every 25 seconds
            const timerTask = timer(100, 25000)
              .subscribe(() => ws.send('"ping"'));
            ws.onClose(() => timerTask.unsubscribe());
            return ws;
          }),
          shareReplay(1),
        );
    }
    return this.ws$;
  }

  sendOnce(data, obFilter, ...filterProperties): Observable<any> {
    return this.getWs()
      .pipe(
        switchMap(ws => {
          const ob = WsService.getDataStreamFromWs(ws);
          ws.send(data);
          return ob;
        }),
        filter(r => (!obFilter || obFilter(r)) &&
          (!filterProperties || filterProperties.some(p => r.hasOwnProperty(p)))),
        take(1),
        timeout(environment.timeout));
  }

  getSessionId(): Observable<string> {
    if (!this.sessionId$) {
      this.sessionId$ = this.sendOnce({action: 'getSessionId'}, null, 'sessionId')
        .pipe(
          map(({sessionId}) => sessionId),
          shareReplay(1),
          tap(() => console.log('getting session id'))
        );
    }
    return this.sessionId$;
  }

}
