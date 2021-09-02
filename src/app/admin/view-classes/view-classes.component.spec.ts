import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewClassesComponent } from './view-classes.component';

describe('ViewClassesComponent', () => {
  let component: ViewClassesComponent;
  let fixture: ComponentFixture<ViewClassesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewClassesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
