import {
  IsValidString,
  IsValidTime,
  IsValidType,
  CommonService,
} from "src/providers/common-service/common.service";
import { FormArray, Validators } from "@angular/forms";
import { FormControl } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import {
  DefaultUserImage,
  ServerError,
  SuccessMessage,
  Rooms,
} from "src/providers/constants";
import * as $ from "jquery";
import { ITable } from "src/providers/Generic/Interface/ITable";
import { AjaxService } from "src/providers/ajax.service";
import { SearchModal } from "../student-report/student-report.component";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  IsClassRoomReady: boolean;
  EmptyMessage: string;
  ShowErrorMsg: boolean;
  ZoneForm: FormGroup;
  RoomCounts: number;
  FacultyImage: any;
  IsUpdateRequest: boolean;
  CurrentSection: any;
  ZoneDetail: Array<Zone>;
  IsZoneReady: boolean;
  StorePopup: boolean;
  GridData: ITable;
  ModalObject: ManageRoomsModal;
  ItemDescription: string;
  SeachData: SearchModal;
  SearchQuery: SearchModal;
  AssignedRoomNo: Array<any>;
  ManageRoomSettingForm: Array<ManageRoomsModal>;
  constructor(
    private commonService: CommonService,
    private http: AjaxService,
    private fb: FormBuilder
  ) {
    this.FacultyImage = DefaultUserImage;
  }

  ngOnInit(): void {
    this.AssignedRoomNo = [];
    this.ShowErrorMsg = false;
    this.SeachData = new SearchModal();
    this.SearchQuery = new SearchModal();
    this.ItemDescription = null;
    this.ModalObject = null;
    this.StorePopup = false;
    this.IsZoneReady = false;
    this.ZoneDetail = [];
    this.CurrentSection = $("#zone");
    this.ManageRoomSettingForm = [];
    this.IsClassRoomReady = false;
    this.EmptyMessage =
      "Enter no.# of total rooms available, including toilet bathroom office etc.";
    this.LoadZone();
  }

  LoadZone() {
    this.http.get("Setting/GetZone").then((result) => {
      if (IsValidString(result.ResponseBody)) {
        let Data = JSON.parse(result.ResponseBody).Table;
        if (IsValidType(Data)) {
          this.ZoneDetail = [];
          this.ZoneDetail = Data;
          this.BuildZone();
          this.IsZoneReady = true;
        }
        this.commonService.ShowToast(SuccessMessage);
      } else {
        this.ZoneDetail = [];
        this.ZoneDetail.push(new Zone());
        this.BuildZone();
        this.IsZoneReady = true;
        this.commonService.ShowToast("No zone found.");
      }
    });
  }

  SelectSection(Type: string) {
    if (Type === "Zone") {
      this.CurrentSection = $("#zone");
    } else if (Type === "Store") {
      this.CurrentSection = $("#store");
    } else if (Type === "ClassRoom") {
      this.CurrentSection = $("#classroom");
      this.SeachData = new SearchModal();
      this.LoadRoomDetail();
    } else if (Type === "Sports") {
      this.CurrentSection = $("#sports");
    }
  }

  GetZoneNames(): FormArray {
    return this.ZoneForm.get("Zones") as FormArray;
  }

  AddZone() {
    let ZoneArray: FormArray = this.ZoneForm.get("Zones") as FormArray;
    ZoneArray.push(
      this.fb.group({
        ZoneName: new FormControl("", Validators.required),
        ZoneDescription: new FormControl("", Validators.required),
      })
    );
    return ZoneArray;
  }

  BuildZone() {
    this.ZoneForm = this.fb.group({
      Zones: this.fb.array(this.BuildZoneArray()),
    });
  }

  BuildZoneArray(): Array<FormGroup> {
    let Data: Array<FormGroup> = [];
    let index = 0;
    while (index < this.ZoneDetail.length) {
      Data.push(
        this.fb.group({
          ZoneName: new FormControl(
            this.ZoneDetail[index].ZoneName,
            Validators.required
          ),
          ZoneDescription: new FormControl(
            this.ZoneDetail[index].ZoneDescription,
            Validators.required
          ),
        })
      );
      index++;
    }
    return Data;
  }

  LoadRoomDetail() {
    this.http.post("Setting/GetRoomDetail", this.SeachData).then((result) => {
      if (IsValidString(result.ResponseBody)) {
        let Data = JSON.parse(result.ResponseBody);
        if (
          IsValidType(Data) &&
          Data["Table"] !== "undefined" &&
          Data["Table1"] !== "undefined" &&
          Data["Table2"] !== "undefined"
        ) {
          this.AssignedRoomNo = Data.Table2;
          this.BindRoomsData(Data.Table, Data.Table1[0].Total);
          this.commonService.ShowToast(SuccessMessage);
        } else {
          this.commonService.ShowToast(
            "Invalid response. Please contact to admin."
          );
        }
      } else {
        this.commonService.ShowToast(ServerError);
      }
    });
  }

  BindRoomsData(RoomData: Array<ManageRoomsModal>, TotalCount: number) {
    if (IsValidType(RoomData)) {
      this.GridData = {
        headers: Rooms,
        rows: RoomData,
        totalCount: TotalCount,
        pageIndex: this.SeachData.PageIndex,
        pageSize: this.SeachData.PageSize,
        url: "",
      };
      this.IsClassRoomReady = true;
    }
  }

  OnEdit($e: any) {
    if (IsValidString($e)) {
      this.ModalObject = JSON.parse($e);
      this.StorePopup = true;
      this.IsUpdateRequest = true;
    }
  }

  OnDelete($e: any) {}

  NextPage($e: any) {
    if (IsValidString($e)) {
      let Data = JSON.parse($e);
      this.SeachData.PageIndex = Data.PageIndex;
      this.LoadRoomDetail();
    }
  }

  PreviousPage($e: any) {}

  AddRows() {
    if (this.RoomCounts > 0) {
      this.http
        .get(`Setting/CreateRooms?RoomsCount=${this.RoomCounts}`)
        .then((result) => {
          if (IsValidString(result.ResponseBody)) {
            let Data = JSON.parse(result.ResponseBody).Table;
            if (IsValidType(Data)) {
              this.BindRoomsData(Data, 50);
              this.commonService.ShowToast(SuccessMessage);
            } else {
              this.commonService.ShowToast(
                "Invalid response. Please contact to admin."
              );
            }
          } else {
            this.commonService.ShowToast(
              "Not able to create. Please contact to admin."
            );
          }
        });
    }
  }

  EditRecord(CurrentRoomUid: string) {}

  DeleteRecord(CurrentRoomUid: string) {
    if (IsValidString(CurrentRoomUid)) {
    } else {
      this.commonService.ShowToast(
        "Unable to process your request. Please refresh or re-login."
      );
    }
  }

  SaveZones() {
    let Data = this.ZoneForm.controls.Zones as FormArray;
    let index = 0;
    while (index < Data.length) {
      if (!Data.at(index).get("ZoneName").valid) {
        this.CurrentSection.find(`div[name="zone-${index}"] > input`).addClass(
          "error-field"
        );
      }
      index++;
    }

    this.http.post("Setting/CreateZone", Data.value).then((result) => {
      if (IsValidString(result.ResponseBody)) {
        this.commonService.ShowToast(SuccessMessage);
      } else {
        this.commonService.ShowToast(ServerError);
      }
    });
  }

  SaveChanges() {
    this.StorePopup = false;
    if (
      this.ModalObject.RoomNo !== null &&
      this.ModalObject.RoomNo.toString().trim() !== ""
    ) {
      this.ModalObject.RoomNo = Number(this.ModalObject.RoomNo.toString());
      if (!isNaN(this.ModalObject.RoomNo)) {
        this.http
          .post("Setting/UpdateCreateRoomData", this.ModalObject)
          .then((result) => {
            if (IsValidString(result.ResponseBody)) {
              let Data = JSON.parse(result.ResponseBody);
              if (
                IsValidType(Data) &&
                Data["Table"] !== "undefined" &&
                Data["Table1"] !== "undefined" &&
                Data["Table2"] !== "undefined"
              ) {
                this.AssignedRoomNo = Data["Table2"];
                if (this.IsUpdateRequest) this.SeachData = new SearchModal();
                this.BindRoomsData(Data.Table, Data.Table1);
                this.commonService.ShowToast(SuccessMessage);
              } else {
                this.commonService.ShowToast(
                  "Invalid response. Please contact to admin."
                );
              }
              this.commonService.ShowToast(SuccessMessage);
            } else {
              this.commonService.ShowToast(ServerError);
            }
          });
      } else {
        this.commonService.ShowToast("Invalid Room no.# supplied.");
      }
    } else {
      this.commonService.ShowToast("Invalid Room no.# supplied.");
    }
  }

  CheckUniqueRoomNo() {
    let value = $(event.currentTarget).val();
    if (this.AssignedRoomNo.length > 0 && value !== "") {
      if (
        this.AssignedRoomNo.filter((x) => x.RoomNo === parseInt(value)).length >
        0
      ) {
        this.ShowErrorMsg = true;
        $(event.currentTarget).addClass("error-field");
        this.commonService.ShowToast(
          "Selected Room no.# already in used. Please selecte unique one."
        );
      } else {
        this.ShowErrorMsg = false;
        $(event.currentTarget).removeClass("error-field");
      }
    }
  }

  Close() {
    this.StorePopup = false;
  }

  EnableStorePopup() {
    this.ModalObject = new ManageRoomsModal();
    this.ModalObject.RoomNo = null;
    this.ModalObject.RoomType = "Not allocated.";
    this.StorePopup = true;
    this.IsUpdateRequest = false;
  }

  GetFilteredData() {}

  FilterLocaldata() {}

  ResetRoomSettingFilter() {}

  ChangeRoomsDetail() {
    let Data = [];
    if (IsValidType(Data)) {
      let ServerData: Array<ManageRoomsModal> = [];
      let ModifiedData = Data.filter((x) => x.touched === true);
      if (ModifiedData.length > 0) {
        let index = 0;
        while (index < ModifiedData.length) {
          ServerData.push(ModifiedData[index].value);
          index++;
        }
      } else {
        this.commonService.ShowToast(
          "No changes found. Please do changes and then submit."
        );
      }
    }
  }
}

class ManageRoomsModal {
  Index: number = 0;
  RoomUid: number = -1;
  Class: string = null;
  Section: string = null;
  RoomNo: number = 0;
  ClassDetailUid: string = null;
  RoomType: string = null;
}

class Zone {
  ZoneUid: number = null;
  ZoneName: string = null;
  ZoneDescription: string = null;
}
