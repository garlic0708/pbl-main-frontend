import {Component, OnInit} from '@angular/core';
import {WsService, GraphqlService} from 'pbl-lib';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {MainAuthService} from '../main-auth.service';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  isCollapsed = false;
  iframeSrc: SafeUrl;

  constructor(private ws: WsService,
              private graphql: GraphqlService,
              private mainAuth: MainAuthService,
              private route: ActivatedRoute,) {
    this.route.paramMap.subscribe(p =>
      console.log('projectId', p.get('projectId'),
        'appId', p.get('appId')));
  }

  ngOnInit(): void {
    this.ws.getSessionId()
      .subscribe(id => {
        console.log('main-session id', id);
        this.graphql.getMe()
          .subscribe(user => {
            console.log('got user', user);
            // this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
            //   `http://localhost:4201?msId=${id}&username=${user.username}`
            // );
          });
      });
    this.graphql.newNotification()
      .subscribe(n => console.log('received notification', n.content));
    // this.graphql.pushNotification('testqq', 'test content')
    //   .subscribe(() => console.log('push complete'));
  }

}
