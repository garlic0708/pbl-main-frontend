import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {CLIENT_ID, PblLibModule} from 'pbl-lib';
import {environment} from '../environments/environment';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    PblLibModule,
    NgZorroAntdModule,
    BrowserAnimationsModule,
  ],
  providers: [{provide: CLIENT_ID, useValue: environment.clientId}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
