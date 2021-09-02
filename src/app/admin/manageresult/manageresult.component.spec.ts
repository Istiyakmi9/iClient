import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManageresultComponent } from './manageresult.component';

describe('ManageresultComponent', () => {
  let component: ManageresultComponent;
  let fixture: ComponentFixture<ManageresultComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
