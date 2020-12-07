import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageannouncementComponent } from './manageannouncement.component';

describe('ManageannouncementComponent', () => {
  let component: ManageannouncementComponent;
  let fixture: ComponentFixture<ManageannouncementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageannouncementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageannouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
