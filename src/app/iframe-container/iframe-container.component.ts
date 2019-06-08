import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProjectService} from '../project.service';
import {GraphqlService, WsService} from 'pbl-lib';
import {forkJoin} from 'rxjs';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-iframe-container',
  templateUrl: './iframe-container.component.html',
  styleUrls: ['./iframe-container.component.scss']
})
export class IframeContainerComponent implements OnInit {

  iframeSrc: SafeUrl;
  appNotExist: boolean;
  appNotTrusted: boolean;

  trustAppLoading = false;

  appName: string;

  srcMap = { // todo
    '71ghuul37mresr7h373b704tua': 'http://localhost:4201',
    '6q665t9tadmslgjpo7cf220qi2': 'http://localhost:4202',
    '4sdpgqdcgd6jiccc449ugibfd4': 'http://localhost:4203',
  };

  constructor(private route: ActivatedRoute,
              private projectService: ProjectService,
              private ws: WsService,
              private graphql: GraphqlService,
              private sanitizer: DomSanitizer,) {
    this.route.paramMap.subscribe(p =>
      console.log('iframe: projectId', p.get('projectId'),
        'appId', p.get('appId')));
  }

  trustApp() {
    this.trustAppLoading = true;
    this.projectService.trustApp(this.getAppId())
      .subscribe(() => {
        this.trustAppLoading = this.appNotTrusted = false;
        this.displayIframe();
      });
  }

  ngOnInit() {
    console.log('init iframe container');
    const appId = this.getAppId();
    const projectId = this.route.parent.snapshot.paramMap.get('projectId');
    forkJoin(
      this.projectService.getApp(appId),
      this.projectService.verifyProject(projectId),
    )
      .subscribe(
        ([app]) => {
          this.appName = app.name;
          if (app.isTrusted) {
            this.displayIframe();
          } else {
            this.appNotTrusted = true;
          }
        },
        () => this.appNotExist = true);
  }

  private displayIframe() {
    const appId = this.getAppId();
    const projectId = this.route.parent.snapshot.paramMap.get('projectId');
    const host = this.srcMap[appId];
    forkJoin(
      this.ws.getSessionId(),
      this.graphql.getMe(),
    ).subscribe(([msId, user]) => {
      this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
        `${host}?msId=${msId}&username=${user.username}&projectId=${projectId}`);
    });
  }

  private getAppId() {
    return this.route.snapshot.paramMap.get('appId');
  }
}
