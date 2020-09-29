import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressreportComponent } from './progressreport.component';

describe('ProgressreportComponent', () => {
  let component: ProgressreportComponent;
  let fixture: ComponentFixture<ProgressreportComponent>;

  beforeEach(async(() => {
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
