import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageexamComponent } from './manageexam.component';

describe('ManageexamComponent', () => {
  let component: ManageexamComponent;
  let fixture: ComponentFixture<ManageexamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageexamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageexamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
