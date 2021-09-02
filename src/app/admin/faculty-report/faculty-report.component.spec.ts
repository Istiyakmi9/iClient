import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FacultyReportComponent } from './faculty-report.component';

describe('FacultyReportComponent', () => {
  let component: FacultyReportComponent;
  let fixture: ComponentFixture<FacultyReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FacultyReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacultyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
