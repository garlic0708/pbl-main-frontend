import { TestBed } from '@angular/core/testing';

import { RouterEventService } from './router-event.service';

describe('RouterEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RouterEventService = TestBed.get(RouterEventService);
    expect(service).toBeTruthy();
  });
});
