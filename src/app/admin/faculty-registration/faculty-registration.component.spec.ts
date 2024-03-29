import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FacultyRegistrationComponent } from './faculty-registration.component';

describe('FacultyRegistrationComponent', () => {
  let component: FacultyRegistrationComponent;
  let fixture: ComponentFixture<FacultyRegistrationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FacultyRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacultyRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
