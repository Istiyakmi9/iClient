import { Component, OnInit } from "@angular/core";
import {
  Paging,
  FacultyRegistration,
} from "src/providers/constants";
import {
  IsValidType,
  CommonService,
  GetReportData,
} from "src/providers/common-service/common.service";
import { AjaxService } from "src/providers/ajax.service";
import { ITable } from "src/providers/Generic/Interface/ITable";
import { iNavigation } from "src/providers/iNavigation";
import { SearchModal } from "../student-report/student-report.component";

@Component({
  selector: "app-faculty-report",
  templateUrl: "./faculty-report.component.html",
  styleUrls: ["./faculty-report.component.sass"],
})
export class FacultyReportComponent implements OnInit {
  DynamicTableDetail: ITable;
  Pagination: [];
  CurrentPageIndex: any;
  Headers: Array<string>;
  GridData: ITable;
  SearchQuery: SearchModal;
  FilterData: string;
  GridRowData: Array<any>;
  constructor(
    private http: AjaxService,
    private commonService: CommonService,
    private nav: iNavigation
  ) {}

  ngOnInit() {
    this.InitQuery();
    this.LoadData();
  }

  InitQuery() {
    this.FilterData = "";
    this.GridRowData = [];
    this.SearchQuery = {
      SearchString: " 1=1 ",
      SortBy: "",
      PageIndex: 1,
      PageSize: 15,
    };
  }

  LoadData() {
    this.http
      .post("Reports/FacultyReports", this.SearchQuery)
      .then((response) => {
        if (this.commonService.IsValidResponse(response)) {
          let Data = JSON.parse(response.ResponseBody);
          let gridData = GetReportData(Data, this.SearchQuery);
          if(gridData != null) {
            this.GridData = gridData;
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
      });
  }

  ResetFilter() {
    this.InitQuery();
    this.LoadData();
  }

  FilterLocaldata() {
    this.SearchQuery.SearchString = ` 
    FirstName like '%${this.FilterData}%' Or  
    LastName like '%${this.FilterData}%' Or  
    MobileNumber like '%${this.FilterData}%' Or  
    Email like  '%${this.FilterData}%'`;
    this.LoadData();
  }

  GetAdvanceFilter() {}

  GetNextPage(param: any) {
    let PageData: Paging = JSON.parse(param);
    if (PageData !== undefined && PageData !== null) {
      this.SearchQuery.PageIndex = PageData.PageIndex;
      this.LoadData();
    }
  }

  GetPreviousPage(param: any) {
    let PageData: Paging = JSON.parse(param);
    alert(JSON.stringify(PageData));
  }

  OnEdit(Data: string) {
    let EditData = JSON.parse(Data);
    if (IsValidType(EditData)) {
      this.nav.navigate(FacultyRegistration, Data);
    } else {
      this.commonService.ShowToast("Invalid user. Please contact to admin.");
    }
  }
}
