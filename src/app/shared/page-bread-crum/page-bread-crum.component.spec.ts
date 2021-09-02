import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PageBreadCrumComponent } from './page-bread-crum.component';

describe('PageBreadCrumComponent', () => {
  let component: PageBreadCrumComponent;
  let fixture: ComponentFixture<PageBreadCrumComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PageBreadCrumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageBreadCrumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
