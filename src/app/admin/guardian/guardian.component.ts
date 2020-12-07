import { Component, OnInit } from "@angular/core";
import { ITable } from "src/providers/Generic/Interface/ITable";
import { SearchModal } from "../student-report/student-report.component";
import { AjaxService } from "src/providers/ajax.service";
import {
  CommonService,
  IsValidResponse,
  IsValidType,
} from "src/providers/common-service/common.service";
import { iNavigation } from "src/providers/iNavigation";
import { ZerothIndex, InvalidData, ManageGuardian } from "src/providers/constants";

@Component({
  selector: 'app-guardian',
  templateUrl: './guardian.component.html',
  styleUrls: ['./guardian.component.scss']
})
export class GuardianComponent implements OnInit {
  Pagination: [];
  CurrentPageIndex: any;
  Headers: Array<string>;
  GridData: ITable;
  IsReady: boolean;
  SearchQuery: SearchModal;

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
    this.IsReady = false;
    this.SearchQuery = new SearchModal();
  }

  LoadData() {
    this.SearchQuery.SearchString = " 1=1 ";
    this.SearchQuery.SortBy = "";
    this.SearchQuery.PageIndex = 1;
    this.SearchQuery.PageSize = 15;

    this.http
      .post("Reports/Guardian", this.SearchQuery)
      .then((response) => {
        if (IsValidType(response.ResponseBody)) {
          this.BuildPage(response);
        } else {
          this.commonService.ShowToast(
            "Server error. Please contact to admin."
          );
        }
      });
  }

  BuildPage(response: any) {
    let Data = JSON.parse(response.ResponseBody);
    if (IsValidType(Data["Rows"]) && IsValidType(Data["Total"]) && IsValidType(Data["Column"])) {
      let TotalCount = Data["Total"][ZerothIndex]["Total"];
      this.GridData = {
        rows: Data["Rows"],
        headers: Data["Column"],
        pageIndex: this.SearchQuery.PageIndex,
        pageSize: this.SearchQuery.PageSize,
        totalCount: TotalCount,
      };
      this.IsReady = true;
    } else {
      this.commonService.ShowToast(InvalidData);
    }
  }

  OnEdit(param: any) {
    if (IsValidType(param)) {
      this.nav.navigate(ManageGuardian, param)
    }
  }

  OnRoomNoSelection(data: any) {
    if (IsValidType(data)) {
     
    }
  }

  OnDelete($e: any) {
    let currentItem = JSON.parse($e);
    if(IsValidType(currentItem)) {
     
    }
  }

  NextPage($e: any) {}

  PreviousPage($e: any) {}

  FilterLocaldata() {}

  ResetFilter() {}

  GetAdvanceFilter() {}
}