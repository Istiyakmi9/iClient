import { FormControl } from "@angular/forms";
import { FormArray, FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { AjaxService } from "src/providers/ajax.service";
import {
  ZerothIndex,
  ServerError,
  SuccessMessage,
  ManageExam,
} from "src/providers/constants";
import { ClassDetail } from "src/app/app.component";
import {
  CommonService,
  IsValidType,
  IsValidString,
  FormateDate,
} from "src/providers/common-service/common.service";
import { iNavigation } from "src/providers/iNavigation";
import { Component, OnInit } from "@angular/core";
import * as $ from "jquery";
import { ApplicationStorage } from "src/providers/ApplicationStorage";

@Component({
  selector: "app-manageexamdetail",
  templateUrl: "./manageexamdetail.component.html",
  styleUrls: ["./manageexamdetail.component.scss"],
})
export class ManageexamdetailComponent implements OnInit {
  PageData: ExamDescriptionModal;
  Faculties: Array<any>;
  ExamDetailForm: FormGroup;
  ClassDetail: Array<ClassDetail>;
  SelectedClass: string;
  ClassDetailUid: string;
  Classes: Array<string>;
  Sections: Array<ClassDetail>;
  ExamDescriptionUid: string;
  IsReady: boolean;
  EmptyMessage: any;
  ExamDetail: Array<ExamDetailModal>;
  ExamDetailItem: ExamDetailModal;
  RoomNos: Array<any>;
  DefaultStartTime: string = "10:25";

  ExamDetailCollection(): FormArray {
    return this.ExamDetailForm.get("ExamDetailCollection") as FormArray;
  }

  // GetExamDetailCollection(): FormArray {
  //   return this.ExamDetailForm.get("ExamDetailCollection") as FormArray;
  // }

  AssignedSubjects(index: number): FormArray {
    return this.ExamDetailCollection()
      .at(index)
      .get("AssignedSubjects") as FormArray;
  }

  constructor(
    private commonService: CommonService,
    private nav: iNavigation,
    private storage: ApplicationStorage,
    private http: AjaxService,
    private fb: FormBuilder
  ) {
    this.ExamDetailForm = this.fb.group({
      ExamDetailCollection: this.fb.array([]),
    });
    this.EmptyMessage =
      "Select Class & Section. Then Press Get Exam Detail Button.";
  }

  ngOnInit(): void {
    this.Faculties = [];
    this.ExamDescriptionUid = "";
    this.IsReady = false;
    this.SelectedClass = "";
    this.PageData = null;
    this.PageData = this.nav.getValue();
    this.ExamDescriptionUid = this.PageData.ExamDescriptionId;
    this.ClassDetail = this.storage.GetClassDetail();
    this.Classes = this.storage.GetClasses();
    this.SelectDefault();
  }

  SelectDefault() {
    this.ClassDetailUid = "";
  }

  GotoMangeExamPage() {
    this.nav.navigate(ManageExam, null);
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

  GetDetail() {
    this.LoadData();
  }

  GetClock() {
    $(event.currentTarget)
      .closest("div")
      .find('app-bh-timepicker[name="clock"]')
      .removeClass("d-none");
  }

  SaveChanges() {
    if (this.ExamDetailForm.valid) {
      if (this.ExamDetailForm.controls.ExamDetailCollection !== undefined) {
        let ExamDetailData = this.ExamDetailForm.controls.ExamDetailCollection
          .value;
        if (IsValidType(ExamDetailData)) {
          this.http
            .post("Exam/ExamDetailUpdate", ExamDetailData)
            .then((result) => {
              if (IsValidString(result.ResponseBody)) {
                this.commonService.ShowToast(SuccessMessage);
              } else {
                this.commonService.ShowToast(ServerError);
              }
            });
        } else {
          this.commonService.ShowToast(
            "Invalid input submitted. Please contact to admin."
          );
        }
      }
    }
  }

  OpenTimerModal() {}

  BuildExamDetailFrom() {
    this.ExamDetailForm = this.fb.group({
      ExamDetailCollection: this.fb.array(this.BuildArray()),
    });
  }

  BuildArray(): Array<FormGroup> {
    let ExamData: Array<FormGroup> = [];
    let index = 0;
    while (index < this.ExamDetail.length) {
      ExamData.push(this.BindExamCollectionData(this.ExamDetail[index]));
      index++;
    }
    return ExamData;
  }

  BindExamCollectionData(Item: ExamDetailModal): FormGroup {
    return this.fb.group({
      SubjectId: new FormControl(Item.SubjectId),
      SubjectName: new FormControl(Item.SubjectName),
      ExamDate: new FormControl(
        IsValidType(Item.ExamDate) ? new Date(Item.ExamDate) : null
      ),
      StartTime: new FormControl(Item.StartTime),
      EndTime: new FormControl(Item.EndTime),
      Duration: new FormControl(Item.Duration),
      FacultyUid: new FormControl(Item.FacultyUid),
      SubjectCode: new FormControl(Item.SubjectCode),
      SubjectCredit: new FormControl(Item.SubjectCredit),
      AcademicYearFrom: new FormControl(Item.AcademicYearFrom),
      AcademicYearTo: new FormControl(Item.AcademicYearTo),
      ExamDescriptionId: new FormControl(this.ExamDescriptionUid),
      ExamDetailId: new FormControl(Item.ExamDetailId),
      ExamName: new FormControl(Item.ExamName),
      Description: new FormControl(Item.Description),
      ExpectedDate: new FormControl(Item.ExpectedDate),
      ActualDate: new FormControl(Item.ActualDate),
      RoomUid: new FormControl(Item.RoomUid),
      Class: new FormControl(this.SelectedClass),
    });
  }

  LoadData() {
    if (
      !IsValidString(this.SelectedClass) ||
      !IsValidString(this.ExamDescriptionUid)
    ) {
      this.commonService.ShowToast("Please selecte class first.");
      return null;
    }
    this.http
      .get(
        `Exam/ExamDetail?Class=${this.SelectedClass}&ExamDescriptionUid=${this.ExamDescriptionUid}`
      )
      .then((result) => {
        if (IsValidString(result.ResponseBody)) {
          let Data = JSON.parse(result.ResponseBody);
          if (
            IsValidType(Data["Table"]) &&
            IsValidType(Data["Table1"]) &&
            IsValidType(Data["Table2"]) &&
            IsValidType(Data["Table3"])
          ) {
            this.PageData = Data["Table"];
            if (IsValidType(this.PageData)) {
              this.PageData = this.PageData[ZerothIndex];
            }
            this.ExamDetail = Data["Table1"];
            let Rooms = Data["Table2"];
            this.Faculties = Data["Table3"];
            this.RoomNos = [];
            if (Rooms !== null && Rooms.length > 0) {
              let index = 0;
              while (index < Rooms.length) {
                this.RoomNos.push({
                  text: Rooms[index].RoomNo,
                  value: Rooms[index].RoomUid,
                });
                index++;
              }
            }
            this.BuildExamDetailFrom();
            this.commonService.ShowToast(SuccessMessage);
            this.IsReady = true;
          } else {
            this.commonService.ShowToast(ServerError);
          }
        } else {
          this.commonService.ShowToast(ServerError);
        }
      });
  }

  ResetFilter() {}

  OnRoomNoSelection(data: any) {
    let ExamData = this.ExamDetailCollection().controls;
    if (ExamData !== null) {
      let ActualValue = JSON.parse(data);
      let Uid = $(event.currentTarget).closest("tr").attr("name");
      let Value = ExamData.filter((x) => x.value.ExamDetailId === Uid);
      if (Value.length > 0) {
        let FormValue: FormGroup = Value[0] as FormGroup;
        if (!isNaN(Number(ActualValue.value))) {
          FormValue.controls.RoomUid.setValue(parseInt(ActualValue.value));
        }
      }
    }
  }

  OnFacultySelection(data: any) {
    let ExamData = this.ExamDetailCollection().controls;
    if (ExamData !== null) {
      let ActualValue = JSON.parse(data);
      let Uid = $(event.currentTarget).closest("tr").attr("name");
      let Value = ExamData.filter((x) => x.value.ExamDetailId === Uid);
      if (Value.length > 0) {
        let FormValue: FormGroup = Value[0] as FormGroup;
        if (!isNaN(Number(ActualValue.value))) {
          FormValue.controls.FacultyUid.setValue(ActualValue.value);
        }
      }
    }
  }
}

interface ExamDetailModal {
  SubjectId: string;
  SubjectName: string;
  ExamDate: string;
  StartTime: string;
  EndTime: string;
  Duration: string;
  schooltenentId: string;
  FacultyUid: string;
  SubjectCode: number;
  SubjectCredit: string;
  AcademicYearFrom: string;
  AcademicYearTo: string;
  ExamDescriptionId: string;
  ExamDetailId: string;
  ExamName: string;
  Description: string;
  ExpectedDate: string;
  ActualDate: string;
  ExamDescriptionId1: string;
  RoomUid: number;
  Class: string;
}

interface ExamDescriptionModal {
  ExamDescriptionId: string;
  TanentUid: string;
  ExamId: number;
  ExamName: string;
  ExpectedDate?: Date;
  ActualDate?: Date;
  Description: string;
}
