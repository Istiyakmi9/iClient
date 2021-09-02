import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManagetimetableComponent } from './managetimetable.component';

describe('ManagetimetableComponent', () => {
  let component: ManagetimetableComponent;
  let fixture: ComponentFixture<ManagetimetableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagetimetableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagetimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
