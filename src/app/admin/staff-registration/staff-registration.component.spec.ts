import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StaffRegistrationComponent } from './staff-registration.component';

describe('StaffRegistrationComponent', () => {
  let component: StaffRegistrationComponent;
  let fixture: ComponentFixture<StaffRegistrationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
