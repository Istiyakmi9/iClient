import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VehicleLocationComponent } from './vehicle-location.component';

describe('VehicleLocationComponent', () => {
  let component: VehicleLocationComponent;
  let fixture: ComponentFixture<VehicleLocationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
