import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoitempageComponent } from './noitempage.component';

describe('NoitempageComponent', () => {
  let component: NoitempageComponent;
  let fixture: ComponentFixture<NoitempageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoitempageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoitempageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
