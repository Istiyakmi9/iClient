import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagetimetableComponent } from './managetimetable.component';

describe('ManagetimetableComponent', () => {
  let component: ManagetimetableComponent;
  let fixture: ComponentFixture<ManagetimetableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagetimetableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagetimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
