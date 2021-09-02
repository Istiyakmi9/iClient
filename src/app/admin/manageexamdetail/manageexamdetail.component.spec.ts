import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManageexamdetailComponent } from './manageexamdetail.component';

describe('ManageexamdetailComponent', () => {
  let component: ManageexamdetailComponent;
  let fixture: ComponentFixture<ManageexamdetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageexamdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageexamdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
