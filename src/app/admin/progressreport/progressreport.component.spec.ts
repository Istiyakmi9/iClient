import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProgressreportComponent } from './progressreport.component';

describe('ProgressreportComponent', () => {
  let component: ProgressreportComponent;
  let fixture: ComponentFixture<ProgressreportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
