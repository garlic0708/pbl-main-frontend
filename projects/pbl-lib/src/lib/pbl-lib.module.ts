import {NgModule, Optional} from '@angular/core';
import {PblLibComponent} from './pbl-lib.component';
import {GQL_AUTH_TOKEN} from './graphql.service';
import {AUTH_CONFIG, authConfigFactory, authTokenFactory, CLIENT_ID, CognitoService} from './cognito.service';
import {WS_URL, wsUrlFactory} from './ws.service';
import {ApolloModule} from 'apollo-angular';
import {HttpLinkModule} from 'apollo-angular-link-http';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [PblLibComponent],
  imports: [
    ApolloModule,
    HttpLinkModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: GQL_AUTH_TOKEN,
      useFactory: authTokenFactory,
      deps: [CognitoService, [new Optional(), CLIENT_ID]],
    },
    {
      provide: AUTH_CONFIG,
      useFactory: authConfigFactory,
    },
    {
      provide: WS_URL,
      useFactory: wsUrlFactory,
      deps: [
        [new Optional(), AUTH_CONFIG],
        [new Optional(), CLIENT_ID],
      ],
    }
  ],
  exports: [PblLibComponent]
})
export class PblLibModule {
}
