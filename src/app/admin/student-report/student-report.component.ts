import { Component, OnInit } from "@angular/core";
import * as $ from "jquery";
import {
  StudentsColumn,
  StudentRegistration,
  Paging,
} from "src/providers/constants";
import { IColumns } from "src/providers/Generic/Interface/IColumns";
import {
  CommonService,
  IsValidType,
} from "src/providers/common-service/common.service";
import { ITable } from "src/providers/Generic/Interface/ITable";
import { AjaxService } from "src/providers/ajax.service";
import { iNavigation } from "src/providers/iNavigation";
import { ClassDetail } from "src/app/app.component";
import { ApplicationStorage } from "src/providers/ApplicationStorage";

@Component({
  selector: "app-student-report",
  templateUrl: "./student-report.component.html",
  styleUrls: ["./student-report.component.scss"],
})
export class StudentReportComponent implements OnInit {
  DynamicTableDetail: ITable;
  Pagination: [];
  CurrentPageIndex: any;
  Headers: Array<string>;
  GridData: ITable;
  SearchQuery: SearchModal;
  ClassDetail: Array<ClassDetail>;
  Classes: Array<string>;
  Sections: Array<ClassDetail>;
  ClassDetailUid: string;
  Class: string;

  constructor(
    private http: AjaxService,
    private commonService: CommonService,
    private nav: iNavigation,
    private storage: ApplicationStorage
  ) {
    this.Class = "";
    this.ClassDetailUid = "";
  }

  ngOnInit() {
    this.ClassDetail = this.storage.GetClassDetail();
    this.InitQuery();
    this.LoadData();
  }

  OnEdit(Data: string) {
    let EditData = JSON.parse(Data);
    if (IsValidType(EditData)) {
      this.nav.navigate(StudentRegistration, Data);
    } else {
      this.commonService.ShowToast("Invalid user. Please contact to admin.");
    }
  }

  OnDelete(Data: string) {}

  NextPage(param: any) {
    let PageData: Paging = JSON.parse(param);
    if (PageData !== undefined && PageData !== null) {
      this.SearchQuery.PageIndex = PageData.PageIndex;
      this.LoadData();
    }
  }

  PreviousPage(param: any) {
    let PageData: Paging = JSON.parse(param);
    alert(JSON.stringify(PageData));
  }

  InitQuery() {
    this.ClassDetailUid = "";
    this.Classes = this.storage.GetClasses();
    this.SearchQuery = {
      SearchString: " 1=1 ",
      SortBy: "",
      PageIndex: 1,
      PageSize: 15,
    };
  }

  EnableSection() {
    this.Sections = [];
    let Class = $(event.currentTarget).val();
    this.BindSections(Class);
  }

  BindSections(Class) {
    if (IsValidType(Class)) {
      this.Sections = this.ClassDetail.filter((x) => x.Class === Class);
      if (this.Sections.length === 0) {
        this.commonService.ShowToast("Unable to load class detail.");
      }
    }
  }

  LoadData() {
    this.http
      .post("Reports/StudentReports", this.SearchQuery)
      .then((response) => {
        if (
          this.commonService.IsValidResponse(response) &&
          IsValidType(response.ResponseBody)
        ) {
          let Data = JSON.parse(response.ResponseBody);
          let Keys = Object.keys(Data);
          if (Keys.indexOf("Table") !== -1 && Keys.indexOf("Table1") !== -1) {
            let GridRowData = Data["Table"];
            let TotalCount = Data["Table1"][0].Total;
            this.GridData = {
              headers: StudentsColumn,
              rows: GridRowData,
              totalCount: TotalCount,
              pageIndex: this.SearchQuery.PageIndex,
              pageSize: this.SearchQuery.PageSize,
              url: "",
            };
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
      })
      .catch((err) => {
        console.log(err);
      });
  }

  ResetFilter() {}

  FilterLocaldata() {}

  GetAdvanceFilter() {}
}

export class SearchModal {
  SearchString: string = " 1=1 ";
  SortBy: string = "";
  PageIndex: number = 1;
  PageSize: number = 20;
}
