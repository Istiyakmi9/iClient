import { FormControl, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { ITable } from "src/providers/Generic/Interface/ITable";
import { AjaxService } from "src/providers/ajax.service";
import {
  CommonService,
  IsValidType,
} from "src/providers/common-service/common.service";
import { iNavigation } from "src/providers/iNavigation";
import { FormGroup, FormBuilder } from "@angular/forms";
import {
  ZerothIndex,
  InvalidData,
  GradeDetailColumn,
} from "src/providers/constants";

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

  constructor(
    private http: AjaxService,
    private commonService: CommonService,
    private nav: iNavigation,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.BuildForm(new GradeDetailModal())
    this.InitQuery();
    this.LoadData();
  }

  BuildForm(ExistingGradeDetailModal: GradeDetailModal) {
    this.GradeDetail = this.fb.group({
      GradeUid: new FormControl(ExistingGradeDetailModal.GradeUid),
      Grade: new FormControl(ExistingGradeDetailModal.Grade, Validators.required),
      Description: new FormControl(ExistingGradeDetailModal.Description),
      MarksRange: new FormControl(ExistingGradeDetailModal.MarksRange),
    });
  }

  InitQuery() {
    this.IsReady = false;
  }

  LoadData() {
    this.http
      .get("Grades/FetchGrade")
      .then((response) => {
        if (IsValidType(response.ResponseBody)) {
          let Data = JSON.parse(response.ResponseBody);
          if (IsValidType(Data["Table"]) && IsValidType(Data["Table1"])) {
            let TotalCount = Data["Table1"][ZerothIndex]["Total"];
            this.GridData = {
              rows: Data["Table"],
              headers: GradeDetailColumn,
              pageIndex: 1,
              pageSize: 1,
              totalCount: TotalCount,
            };
            this.IsReady = true;
          } else {
            this.commonService.ShowToast(InvalidData);
          }
        } else {
          this.commonService.ShowToast(
            "Server error. Please contact to admin."
          );
        }
      });
  }

  AddClassSection() {
    let Error = [];
    let Grade = this.GradeDetail.get("Grade").value;
    if (Grade === "") {
      Error.push("Grade");
    }
    let MarksRange = this.GradeDetail.get("MarksRange").value;
    if (MarksRange === "") {
      Error.push("MarksRange");
    }
    if (Error.length > 0) {
      this.commonService.ShowToast("All fields are required.");
    } else {
      this.http
        .post("Grades/AddUpdateGrade", this.GradeDetail.value)
        .then((response) => {
          if (IsValidType(response.ResponseBody)) {
            let Data = JSON.parse(response.ResponseBody);
            if (IsValidType(Data["Table"]) && IsValidType(Data["Table1"])) {
              let TotalCount = Data["Table1"][ZerothIndex]["Total"];
              this.GridData = {
                rows: Data["Table"],
                headers: GradeDetailColumn,
                pageIndex: 1,
                pageSize: 0,
                totalCount: TotalCount,
              };
              this.IsReady = true;
              this.commonService.ShowToast("Grade inserted successfully");
              this.BuildForm(new GradeDetailModal());
            } else {
              this.commonService.ShowToast(InvalidData);
            }
          } else {
            this.commonService.ShowToast(
              "Server error. Please contact to admin."
            );
          }
        });
      }
  }

  OnEdit($e: any) {
    if (IsValidType($e)) {
      let CurrentItem: GradeDetailModal = JSON.parse($e);
      this.BuildForm(CurrentItem);
    }
  }

  ClearForm(){
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
  MarksRange: string = "";
}
