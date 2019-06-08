import {Observable, of} from 'rxjs';
import {share, shareReplay} from 'rxjs/operators';

export class ItemCache {
  cacheSet = new Map();

  addToSet(...items) {
    items.forEach((item) => this.cacheSet.set(item.id, item));
  }

  clearItems() {
    this.cacheSet.clear();
  }

  isIdInSet(id) {
    return this.cacheSet.has(id);
  }

  getItem(id) {
    return this.cacheSet.get(id);
  }

  removeItem(id) {
    this.cacheSet.delete(id);
  }

  getList() {
    return Array.from(this.cacheSet.values());
  }

  putObservable(id, ob: Observable<any>) {
    ob = ob.pipe(shareReplay(1));
    this.cacheSet.set(id, {id, _ob: ob});
    ob.subscribe(v => {
      this.cacheSet.set(id, v);
    });
  }

  getObservable(id): Observable<any> {
    const item = this.getItem(id);
    if (item.hasOwnProperty('_ob')) {
      return item._ob;
    }
    return of(item);
  }
}
