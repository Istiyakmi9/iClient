import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TrackOnMapComponent } from './track-on-map.component';

describe('TrackOnMapComponent', () => {
  let component: TrackOnMapComponent;
  let fixture: ComponentFixture<TrackOnMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackOnMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackOnMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
