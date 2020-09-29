import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageresultComponent } from './manageresult.component';

describe('ManageresultComponent', () => {
  let component: ManageresultComponent;
  let fixture: ComponentFixture<ManageresultComponent>;

  beforeEach(async(() => {
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
