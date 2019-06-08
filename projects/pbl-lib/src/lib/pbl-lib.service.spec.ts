import { TestBed } from '@angular/core/testing';

import { PblLibService } from './pbl-lib.service';

describe('PblLibService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PblLibService = TestBed.get(PblLibService);
    expect(service).toBeTruthy();
  });
});
