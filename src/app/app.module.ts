import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgZorroAntdModule, NZ_I18N, en_US} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {Ng2UiAuthModule} from 'ng2-ui-auth';
import {environment} from '../environments/environment';
import {LoginCompleteComponent} from './login-complete/login-complete.component';
import {MainComponent} from './main/main.component';
import {LeftControlComponent} from './left-control/left-control.component';
import {PblLibModule} from 'pbl-lib';
import {WS_URL_MAIN, GQL_AUTH_TOKEN_MAIN} from 'pbl-lib';
import {authTokenFactory, MainAuthService} from './main-auth.service';
import {wsUrlFactory} from './ws-message.service';
import {IframeContainerComponent} from './iframe-container/iframe-container.component';
import {RouteReuseStrategy} from '@angular/router';
import {ReuseIframeStrategy} from './route-reuse-strategy';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    LoginCompleteComponent,
    MainComponent,
    LeftControlComponent,
    IframeContainerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    Ng2UiAuthModule.forRoot({
      providers: {
        cognito: {
          authorizationEndpoint: environment.authEndpoint,
          clientId: environment.authClientId,
          responseType: 'token',
          scope: ['openid'],
          redirectUri: environment.authCallbackUrl,
        }
      }
    }),
    PblLibModule,
  ],
  providers: [
    {provide: NZ_I18N, useValue: en_US},
    {provide: GQL_AUTH_TOKEN_MAIN, useFactory: authTokenFactory, deps: [MainAuthService]},
    {provide: WS_URL_MAIN, useFactory: wsUrlFactory, deps: [MainAuthService]},
    {provide: RouteReuseStrategy, useClass: ReuseIframeStrategy},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
