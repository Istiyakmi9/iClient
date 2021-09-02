import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StaffReportComponent } from './staff-report.component';

describe('StaffReportComponent', () => {
  let component: StaffReportComponent;
  let fixture: ComponentFixture<StaffReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
