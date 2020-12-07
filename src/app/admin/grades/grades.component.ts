import { FormControl, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { ITable } from "src/providers/Generic/Interface/ITable";
import { AjaxService } from "src/providers/ajax.service";
import {
  CommonService,
  GetReportData,
  IsValidType,
} from "src/providers/common-service/common.service";
import { iNavigation } from "src/providers/iNavigation";
import { FormGroup, FormBuilder } from "@angular/forms";
import {
  ZerothIndex,
  InvalidData,
  GradeDetailColumn,
  ServerError,
} from "src/providers/constants";
import { SearchModal } from '../student-report/student-report.component';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.scss']
})
export class GradesComponent implements OnInit {
  DynamicTableDetail: ITable;
  Pagination: [];
  CurrentPageIndex: any;
  Headers: Array<string>;
  GridData: ITable;
  IsReady: boolean;
  GradeDetail: FormGroup;
  SearchQuery: SearchModal;
  isUpdate: boolean = false;
  butMessage: string = "Insert Grade";

  constructor(
    private http: AjaxService,
    private commonService: CommonService,
    private nav: iNavigation,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.SearchQuery = new SearchModal();
    this.BuildForm(new GradeDetailModal())
    this.InitQuery();
    this.LoadData();
  }

  BuildForm(ExistingGradeDetailModal: GradeDetailModal) {
    this.GradeDetail = this.fb.group({
      GradeUid: new FormControl(ExistingGradeDetailModal.GradeUid),
      Grade: new FormControl(ExistingGradeDetailModal.Grade, Validators.required),
      Description: new FormControl(ExistingGradeDetailModal.Description),
      MinMarks: new FormControl(ExistingGradeDetailModal.MinMarks),
      MaxMarks: new FormControl(ExistingGradeDetailModal.MaxMarks),
    });
  }

  InitQuery() {
    this.IsReady = false;
  }

  LoadData() {
    this.http
      .get("Grades/FetchGrade")
      .then((response) => {
        try{
          this.BuildGrid(response);
        } catch(e) {
          this.commonService.ShowToast(ServerError);
        }
      });
  }

  BuildGrid(response: any) {
    if (IsValidType(response.ResponseBody)) {
      let Data = JSON.parse(response.ResponseBody);
      let gridData = GetReportData(Data, this.SearchQuery);
      if(gridData != null) {
        this.GridData = gridData;
        this.IsReady = true;
      } else {
        this.commonService.ShowToast(
          "Receive invalid data. Please contact to admin."
        );
      }
    } else {
      this.commonService.ShowToast(
        "Server error. Please contact to admin."
      );
    }
  }

  AddClassSection() {
    let Error = [];
    let Grade = this.GradeDetail.get("Grade").value;
    if (Grade === "") {
      Error.push("Grade");
    }

    let MinMarks = this.GradeDetail.get("MinMarks").value;
    if (MinMarks === "") {
      Error.push("MinMarks");
    } else {
      let value = Number(this.GradeDetail.get("MinMarks").value);
      if(isNaN(value)) {
        Error.push("MinMarks");
      } else 
        this.GradeDetail.controls["MinMarks"].setValue(value)
    }

    let MaxMarks = this.GradeDetail.get("MaxMarks").value;
    if (MaxMarks === "") {
      Error.push("MaxMarks");
    } else {
      let value = Number(this.GradeDetail.get("MaxMarks").value);
      if(isNaN(value)) {
        Error.push("MaxMarks");
      } else 
        this.GradeDetail.controls["MaxMarks"].setValue(value)
    }

    if (Error.length > 0) {
      this.commonService.ShowToast("All fields are required.");
    } else {
      this.http
        .post("Grades/AddUpdateGrade", this.GradeDetail.value)
        .then((response) => {
          this.ClearForm();
          try{
            this.BuildGrid(response);
            if(this.isUpdate)
              this.commonService.ShowToast('Record updated successfully');
            else 
              this.commonService.ShowToast('Record inserted successfully');
          } catch(e) {
            this.commonService.ShowToast(ServerError);
          }
        });
      }
  }

  OnEdit($e: any) {
    if (IsValidType($e)) {
      this.isUpdate = true;
      this.butMessage = "Update Grade";
      let CurrentItem: GradeDetailModal = JSON.parse($e);
      this.BuildForm(CurrentItem);
    }
  }

  ClearForm(){
    this.isUpdate = true;
    this.butMessage = "Insert Grade";
    this.BuildForm(new GradeDetailModal());
  }

  OnDelete($e: any) {}

  NextPage($e: any) {}

  PreviousPage($e: any) {}

  FilterLocaldata() {}

  ResetFilter() {}

  GetAdvanceFilter() {}
}

export class GradeDetailModal {
  GradeUid: number = -1;
  Grade: string = "";
  Description: string = "";
  MinMarks: number = null;
  MaxMarks: number = null;
}
