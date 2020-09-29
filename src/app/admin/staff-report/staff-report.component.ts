import { Component, OnInit } from "@angular/core";
import { StaffMemberColumn } from "src/providers/constants";
import {
  IsValidType,
  CommonService
} from "src/providers/common-service/common.service";
import { AjaxService } from "src/providers/ajax.service";
import { SearchModal } from "../student-report/student-report.component";
import { ITable } from "src/providers/Generic/Interface/ITable";

@Component({
  selector: "app-staff-report",
  templateUrl: "./staff-report.component.html",
  styleUrls: ["./staff-report.component.sass"]
})
export class StaffReportComponent implements OnInit {
  DynamicTableDetail: ITable;
  Pagination: [];
  CurrentPageIndex: any;
  Headers: Array<string>;
  GridData: ITable;
  SearchQuery: SearchModal;
  constructor(
    private http: AjaxService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.InitQuery();
    this.LoadData();
  }

  InitQuery() {
    this.SearchQuery = {
      SearchString: " 1=1 ",
      SortBy: "",
      PageIndex: 1,
      PageSize: 15
    };
  }

  LoadData() {
    this.SearchQuery.SearchString = " 1=1 ";
    this.SearchQuery.SortBy = "";
    this.SearchQuery.PageIndex = 1;
    this.SearchQuery.PageSize = 15;

    this.http.post("Reports/StaffReport", this.SearchQuery).then(response => {
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
            headers: StaffMemberColumn,
            rows: GridRowData,
            totalCount: TotalCount,
            pageIndex: this.SearchQuery.PageIndex,
            pageSize: this.SearchQuery.PageSize,
            url: ""
          };
        } else {
          this.commonService.ShowToast(
            "Receive invalid data. Please contact to admin."
          );
        }
      } else {
        this.commonService.ShowToast("Server error. Please contact to admin.");
      }
    });
  }

  ResetFilter() {}

  FilterLocaldata() {}

  GetAdvanceFilter() {}
}
