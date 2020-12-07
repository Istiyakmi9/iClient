import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagenoticeComponent } from './managenotice.component';

describe('ManagenoticeComponent', () => {
  let component: ManagenoticeComponent;
  let fixture: ComponentFixture<ManagenoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagenoticeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagenoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
