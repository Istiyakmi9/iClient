import { FormControl, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { ITable } from "src/providers/Generic/Interface/ITable";
import { SearchModal } from "../student-report/student-report.component";
import { AjaxService } from "src/providers/ajax.service";
import {
  CommonService,
  IsValidType,
} from "src/providers/common-service/common.service";
import { iNavigation } from "src/providers/iNavigation";
import { FormGroup, FormBuilder } from "@angular/forms";
import * as $ from "jquery";
import {
  IAutoCompleteModal,
  ZerothIndex,
  ClassDetailColumn,
  InvalidData,
} from "src/providers/constants";

@Component({
  selector: "app-view-classes",
  templateUrl: "./view-classes.component.html",
  styleUrls: ["./view-classes.component.scss"],
})
export class ViewClassesComponent implements OnInit {
  DynamicTableDetail: ITable;
  Pagination: [];
  CurrentPageIndex: any;
  Headers: Array<string>;
  GridData: ITable;
  IsReady: boolean;
  SearchQuery: SearchModal;
  Classdetail: FormGroup;
  RoomNos: Array<IAutoCompleteModal>;
  ClassdetailView: Array<ClassdetailModal>;
  OriginalRoomNos: Array<IAutoCompleteModal>;
  constructor(
    private http: AjaxService,
    private commonService: CommonService,
    private nav: iNavigation,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.InitQuery();
    this.LoadData();
  }

  InitQuery() {
    this.IsReady = false;
    this.LoadForm(new ClassdetailModal());
    this.SearchQuery = new SearchModal();
  }

  LoadForm(ExistingClassDetail: ClassdetailModal) {
    let RoomUidValue = -1;
    if (ExistingClassDetail.RoomUid !== null) {
      RoomUidValue = ExistingClassDetail.RoomUid;
    }
    this.Classdetail = this.fb.group({
      ClassDetailUid: new FormControl(ExistingClassDetail.ClassDetailUid),
      Class: new FormControl(ExistingClassDetail.Class, Validators.required),
      TotalSeats: new FormControl(
        ExistingClassDetail.TotalSeats,
        Validators.required
      ),
      Section: new FormControl(
        ExistingClassDetail.Section,
        Validators.required
      ),
      GirlSeats: new FormControl(
        ExistingClassDetail.GirlSeats,
        Validators.required
      ),
      BoySeats: new FormControl(
        ExistingClassDetail.BoySeats,
        Validators.required
      ),
      RoomNo: new FormControl(ExistingClassDetail.RoomNo, Validators.required),
      RoomUid: new FormControl(RoomUidValue, Validators.required),
    });
  }

  UniqueRoomsData() {
    this.RoomNos = [];
    this.RoomNos = this.OriginalRoomNos;
  }

  LoadData() {
    this.SearchQuery.SearchString = " 1=1 ";
    this.SearchQuery.SortBy = "";
    this.SearchQuery.PageIndex = 1;
    this.SearchQuery.PageSize = 15;

    this.http
      .post("AdminMaster/GetClassDetail", this.SearchQuery)
      .then((response) => {
        if (IsValidType(response.ResponseBody)) {
          let Data = JSON.parse(response.ResponseBody);
          if (IsValidType(Data["Table"]) && IsValidType(Data["Table1"])) {
            if (IsValidType(Data["Table2"])) {
              this.OriginalRoomNos = [];
              let DataSet = Data["Table2"];
              let index = 0;
              while (index < DataSet.length) {
                this.OriginalRoomNos.push({
                  text:
                    DataSet[index].RoomNo +
                    "   [" +
                    DataSet[index].RoomType +
                    "]",
                  value: DataSet[index].RoomUid,
                });
                index++;
              }
            }

            this.RoomNos = this.OriginalRoomNos;

            let TotalCount = Data["Table1"][ZerothIndex]["Total"];
            this.GridData = {
              rows: Data["Table"],
              headers: ClassDetailColumn,
              pageIndex: this.SearchQuery.PageIndex,
              pageSize: this.SearchQuery.PageSize,
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
    if (!IsValidType(this.Classdetail.get("Class").value)) {
      Error.push("Class");
    }

    if (!IsValidType(this.Classdetail.get("Section").value)) {
      Error.push("Section");
    }

    let TotalSeats = this.Classdetail.get("TotalSeats").value;
    if (TotalSeats === "") {
      Error.push("TotalSeats");
    } else {
      this.Classdetail.get("TotalSeats").setValue(parseInt(TotalSeats));
    }

    let GirlSeats = this.Classdetail.get("GirlSeats").value;
    if (GirlSeats === "") {
      Error.push("GirlSeats");
    } else {
      this.Classdetail.get("GirlSeats").setValue(parseInt(GirlSeats));
    }

    let BoySeats = this.Classdetail.get("BoySeats").value;
    if (BoySeats === "") {
      Error.push("BoySeats");
    } else {
      this.Classdetail.get("BoySeats").setValue(parseInt(BoySeats));
    }

    if (Error.length > 0) {
      this.commonService.ShowToast("All fields are required.");
    } else {
      this.http
        .post("AdminMaster/InsertNewClassInfo", this.Classdetail.value)
        .then((response) => {
          if (IsValidType(response.ResponseBody)) {
            let Data = JSON.parse(response.ResponseBody);
            if (
              typeof Data["Table"] === "undefined" ||
              typeof Data["Table1"] === "undefined"
            ) {
              this.commonService.ShowToast(InvalidData);
            } else {
              let TotalCount = Data["Table1"][ZerothIndex]["Total"];
              this.GridData = {
                rows: Data["Table"],
                headers: ClassDetailColumn,
                pageIndex: this.SearchQuery.PageIndex,
                pageSize: this.SearchQuery.PageSize,
                totalCount: TotalCount,
              };
              this.IsReady = true;
              this.commonService.ShowToast("Insert or update successfull.");
              this.LoadForm(new ClassdetailModal());
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
      let CurrentItem: ClassdetailModal = JSON.parse($e);
      this.LoadForm(CurrentItem);
    }
  }

  OnRoomNoSelection(data: any) {
    if (IsValidType(data)) {
      let ActualValue = JSON.parse(data);
      if (!isNaN(Number(ActualValue.value))) {
        this.Classdetail.controls.RoomUid.setValue(ActualValue.value);
      }
    }
  }

  OnDelete($e: any) {}

  NextPage($e: any) {}

  PreviousPage($e: any) {}

  FilterLocaldata() {}

  ResetFilter() {}

  GetAdvanceFilter() {}
}

export class ClassdetailModal {
  ClassDetailUid: string = "";
  Class: string = "";
  TotalSeats?: number = null;
  Section: string = "";
  GirlSeats?: number = null;
  BoySeats?: number = null;
  RoomNo?: string = null;
  RoomUid?: number = null;
}
