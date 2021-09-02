import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManagerolesComponent } from './manageroles.component';

describe('ManagerolesComponent', () => {
  let component: ManagerolesComponent;
  let fixture: ComponentFixture<ManagerolesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
