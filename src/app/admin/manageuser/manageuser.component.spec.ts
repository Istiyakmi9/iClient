import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManageuserComponent } from './manageuser.component';

describe('ManageuserComponent', () => {
  let component: ManageuserComponent;
  let fixture: ComponentFixture<ManageuserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
