import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginCompleteComponent} from './login-complete/login-complete.component';
import {MainComponent} from './main/main.component';
import {IframeContainerComponent} from './iframe-container/iframe-container.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginCompleteComponent,
  },
  {
    path: ':projectId',
    component: MainComponent,
    children: [
      {
        path: ':appId',
        component: IframeContainerComponent,
      }
    ]
  },
  {
    path: '',
    component: MainComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
