import {RouteReuseStrategy, DetachedRouteHandle} from '@angular/router';
import {ActivatedRouteSnapshot} from '@angular/router';
import {IframeContainerComponent} from './iframe-container/iframe-container.component';

export class ReuseIframeStrategy implements RouteReuseStrategy {
  private cache = new Map<string, DetachedRouteHandle>();

  private static isIframeContainer(future: ActivatedRouteSnapshot, requireExisting = true) {
    const name = future.component && (future.component as any).name;
    return name === 'IframeContainerComponent' && (!requireExisting || !(future.component as any).appNotExist);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return ReuseIframeStrategy.isIframeContainer(route, false) && this.cache.has(route.routeConfig.path);
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return ReuseIframeStrategy.isIframeContainer(route);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return this.cache.get(route.routeConfig.path);
  }

  store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
    this.cache.set(route.routeConfig.path, detachedTree);
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig &&
      !ReuseIframeStrategy.isIframeContainer(future, false);
  }
}
