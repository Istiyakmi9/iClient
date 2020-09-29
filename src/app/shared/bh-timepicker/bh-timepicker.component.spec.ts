import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BhTimepickerComponent } from './bh-timepicker.component';

describe('BhTimepickerComponent', () => {
  let component: BhTimepickerComponent;
  let fixture: ComponentFixture<BhTimepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BhTimepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BhTimepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
