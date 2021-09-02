import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UploadresultComponent } from './uploadresult.component';

describe('UploadresultComponent', () => {
  let component: UploadresultComponent;
  let fixture: ComponentFixture<UploadresultComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
