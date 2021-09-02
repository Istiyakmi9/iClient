import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuickRegistrationComponent } from './quick-registration.component';

describe('QuickRegistrationComponent', () => {
  let component: QuickRegistrationComponent;
  let fixture: ComponentFixture<QuickRegistrationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
