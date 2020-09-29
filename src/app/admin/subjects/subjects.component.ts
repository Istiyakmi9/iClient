import { Component, OnInit } from "@angular/core";
import { ITable } from "src/providers/Generic/Interface/ITable";
import { SearchModal } from "../student-report/student-report.component";
import { AjaxService } from "src/providers/ajax.service";
import {
  CommonService,
  IsValidType,
  IsValidString
} from "src/providers/common-service/common.service";
import { iNavigation } from "src/providers/iNavigation";
import * as $ from "jquery";
import {
  StudentsColumn,
  SubjectColumn,
  ServerError,
  SuccessMessage
} from "src/providers/constants";
import { ApplicationStorage } from "src/providers/ApplicationStorage";

@Component({
  selector: "app-subjects",
  templateUrl: "./subjects.component.html",
  styleUrls: ["./subjects.component.scss"]
})
export class SubjectsComponent implements OnInit {
  DynamicTableDetail: ITable;
  Pagination: [];
  CurrentPageIndex: any;
  Headers: Array<string>;
  GridData: ITable;
  SearchQuery: SearchModal;
  Classes: Array<string>;
  SubjectForm: SubjectModal;
  SubjectFormId: string;
  constructor(
    private http: AjaxService,
    private commonService: CommonService,
    private nav: iNavigation,
    private storage: ApplicationStorage
  ) {
    this.SubjectForm = new SubjectModal();
    this.SubjectForm.ForClass = "";
  }

  ngOnInit() {
    this.Classes = this.storage.GetClasses();
    this.InitQuery();
    this.LoadData();
    this.SubjectFormId = $("#subject-form");
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
    this.http.post("Events/AllSubjects", this.SearchQuery).then(response => {
      if (IsValidType(response.ResponseBody)) {
        let Data = JSON.parse(response.ResponseBody);
        let Keys = Object.keys(Data);
        if (Keys.indexOf("Table") !== -1 && Keys.indexOf("Table1") !== -1) {
          this.SubjectForm.ForClass = "";
          let GridRowData = Data["Table"];
          let TotalCount = Data["Table1"][0].Total;
          this.GridData = {
            headers: SubjectColumn,
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

  AddSubject() {
    let errorCount = 0;
    if (!IsValidString(this.SubjectForm.SubjectName)) {
      $(this.SubjectFormId)
        .find('input[name="SubjectName"]')
        .addClass("error-field");
      errorCount++;
    }

    try {
      this.SubjectForm.SubjectCredit = parseInt(
        this.SubjectForm.SubjectCredit.toString()
      );
    } catch (e) {
      this.SubjectForm.SubjectCredit;
    }

    if (!IsValidType(this.SubjectForm.SubjectCode)) {
      $(this.SubjectFormId)
        .find('input[name="SubjectCode"]')
        .addClass("error-field");
      errorCount++;
    } else {
      try {
        this.SubjectForm.SubjectCode = parseInt(
          this.SubjectForm.SubjectCode.toString()
        );
      } catch (e) {
        this.commonService.ShowToast("Subject code must be an integer value.");
        return;
      }
    }

    if (this.SubjectForm.IsActive === null) {
      this.SubjectForm.IsActive = false;
    } else {
      if (typeof this.SubjectForm.IsActive === "number") {
        if (this.SubjectForm.IsActive === 1) {
          this.SubjectForm.IsActive = true;
        } else {
          this.SubjectForm.IsActive = false;
        }
      }
    }

    if (errorCount > 0) {
      this.commonService.ShowToast("Red marked fields are mandatory.");
    } else {
      this.http
        .post("MasterData/AddEditSubjects", this.SubjectForm)
        .then(result => {
          $("#GlobalFilter").val("");
          this.SubjectForm = new SubjectModal();
          if (IsValidType(result.ResponseBody)) {
            let Data = JSON.parse(result.ResponseBody);
            let Keys = Object.keys(Data);
            if (Keys.indexOf("Table") !== -1 && Keys.indexOf("Table1") !== -1) {
              let GridRowData = Data["Table"];
              let TotalCount = Data["Table1"][0].Total;
              this.GridData = {
                headers: SubjectColumn,
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
            this.commonService.ShowToast(ServerError);
          }
        });
    }
  }

  EnableField() {
    $(event.currentTarget).removeClass("error-field");
  }

  MakeActive() {}

  OnEdit($e: any) {
    if (IsValidString($e)) {
      this.SubjectForm = JSON.parse($e);
    }
  }

  OnDelete($e: any) {}

  NextPage($e: any) {
    if (IsValidString($e)) {
      let Data = JSON.parse($e);
      if (IsValidType(Data["PageIndex"])) {
        this.SearchQuery.PageIndex = parseInt(Data["PageIndex"]);
        this.LoadData();
      }
    }
  }

  PreviousPage($e: any) {}

  FilterLocaldata() {
    if ($(event.currentTarget).val().length >= 3) {
      let Query = `1=1 and SubjectName like '${$(event.currentTarget).val()}%' 
      or SubjectCode  like '${$(event.currentTarget).val()}%' 
      or SubjectCredit like '${$(event.currentTarget).val()}%' 
      or ForClass like '${$(event.currentTarget).val()}%'`;
      this.SearchQuery.SearchString = Query;
      this.LoadData();
    }
  }

  ResetFilter() {
    $("#GlobalFilter").val("");
    this.InitQuery();
    this.LoadData();
  }

  GetAdvanceFilter() {}
}

export class SubjectModal {
  SubjectId: string = null;
  SubjectName: string = null;
  SubjectCode: number = null;
  SubjectCredit: number = null;
  ForClass: string = null;
  IsActive: boolean = false;
}
