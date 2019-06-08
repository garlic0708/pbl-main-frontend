import {Injectable} from '@angular/core';
import {NavigationEnd, Router, RouterEvent} from '@angular/router';
import {ProjectService} from './project.service';

@Injectable({
  providedIn: 'root',
})
export class RouterEventService {

  constructor(private router: Router,
              private projectService: ProjectService,) {
    console.log('router event service working');
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.onNavigation(e);
      }
    });
  }

  onNavigation(event: RouterEvent) {
    const match = event.url.match(/^\/(([^/]+)(\/([^/]+))?)?$/);
    const [projectId, appId] = [match[2], match[4]];
    this.projectService.navigate(projectId, appId);
  }
}
