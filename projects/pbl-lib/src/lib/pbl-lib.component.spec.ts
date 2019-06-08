import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PblLibComponent } from './pbl-lib.component';

describe('PblLibComponent', () => {
  let component: PblLibComponent;
  let fixture: ComponentFixture<PblLibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PblLibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PblLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
