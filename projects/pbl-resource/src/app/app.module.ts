import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {PblLibModule, CLIENT_ID} from 'pbl-lib';
import {environment} from '../environments/environment';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgZorroAntdModule,
    PblLibModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [{provide: CLIENT_ID, useValue: environment.clientId}],
  bootstrap: [AppComponent]
})
export class AppModule { }
