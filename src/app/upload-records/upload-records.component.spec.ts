import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UploadRecordsComponent } from './upload-records.component';

describe('UploadRecordsComponent', () => {
  let component: UploadRecordsComponent;
  let fixture: ComponentFixture<UploadRecordsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
