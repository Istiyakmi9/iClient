import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageguardianComponent } from './manageguardian.component';

describe('ManageguardianComponent', () => {
  let component: ManageguardianComponent;
  let fixture: ComponentFixture<ManageguardianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageguardianComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageguardianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
