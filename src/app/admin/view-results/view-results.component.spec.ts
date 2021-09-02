import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewResultsComponent } from './view-results.component';

describe('ViewResultsComponent', () => {
  let component: ViewResultsComponent;
  let fixture: ComponentFixture<ViewResultsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
