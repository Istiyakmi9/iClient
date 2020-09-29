import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { SuccessMessage, ZerothIndex } from "src/providers/constants";
import { InvalidData } from "src/providers/constants";
import { AjaxService } from "src/providers/ajax.service";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, FormArray, FormBuilder } from "@angular/forms";
import {
  CommonService,
  IsValidType,
} from "src/providers/common-service/common.service";
import { ApplicationStorage } from "src/providers/ApplicationStorage";
import * as $ from "jquery";
import { ClassDetail } from "src/app/app.component";
import { AttendanceSheetModal } from "../attendance/attendance.component";

@Component({
  selector: "app-monthly-attendance",
  templateUrl: "./monthly-attendance.component.html",
  styleUrls: ["./monthly-attendance.component.scss"],
})
export class MonthlyAttendanceComponent implements OnInit {
  IsReady: boolean;
  TodayDayNum: string;
  Days: any;
  dateModel: NgbDateStruct;
  ClassDetailUid: string;
  ClassDetail: Array<ClassDetail>;
  Sections: Array<ClassDetail>;
  Classes: Array<string>;
  SelecteClass: string;
  AttendanceSheet: Array<AttendanceSheetModal>;
  MonthlyAttendanceData: FormGroup;
  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private http: AjaxService,
    private storage: ApplicationStorage
  ) {
    this.TodayDayNum = new Date().getDate().toString();
  }

  get AttendaceDetail(): FormArray {
    return this.MonthlyAttendanceData.get("AttendaceDetail") as FormArray;
  }

  SelectDefault() {
    if (IsValidType(this.ClassDetail)) {
      let FirstItem = this.ClassDetail[ZerothIndex];
      this.BindSections(FirstItem.Class);
      this.SelecteClass = FirstItem.Class;
      this.ClassDetailUid = FirstItem.ClassDetailUid;
      this.LoadData();
    } else {
      this.InitAttendance();
      this.IsReady = true;
    }
  }

  selectDate(date: Date) {
    if (date !== null) {
      let selectedDate: NgbDateStruct = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      };
      this.dateModel = selectedDate;
    }
  }

  ngOnInit(): void {
    let index = 1;
    this.Days = [];
    while (index <= 31) {
      this.Days.push(index);
      index++;
    }
    this.SelecteClass = "";
    this.ClassDetail = this.storage.GetClassDetail();
    this.Classes = this.storage.GetClasses();
    this.ClassDetailUid = "";
    this.selectDate(new Date());
    this.SelectDefault();
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
      .post("AdminMaster/AttendenceByClassDetail", {
        ClassDetailUid: this.ClassDetailUid,
        CreatedOn: new Date(
          this.dateModel.year,
          this.dateModel.month - 1,
          this.dateModel.day
        ),
      })
      .then((result) => {
        if (IsValidType(result.ResponseBody)) {
          let Data = JSON.parse(result.ResponseBody);
          if (IsValidType(Data["Table"])) {
            this.AttendanceSheet = Data["Table"];
            this.InitAttendance();
            this.IsReady = true;
          } else {
            this.commonService.ShowToast(InvalidData);
          }
          this.commonService.ShowToast(SuccessMessage);
        } else {
          this.commonService.ShowToast(InvalidData);
        }
      });
  }

  InitAttendance() {
    this.MonthlyAttendanceData = this.fb.group({
      AttendaceDetail: this.fb.array(this.BindStudentData()),
    });
  }

  BindStudentData(): Array<FormGroup> {
    let index = 0;
    let Data: Array<FormGroup> = [];
    if (IsValidType(this.AttendanceSheet)) {
      while (index < this.AttendanceSheet.length) {
        Data.push(
          this.BuildStudentAttendanceDetail(this.AttendanceSheet[index])
        );
        index++;
      }
    }
    return Data;
  }

  HandlePresentAttendace(StudentUid: string, DayNum: string) {
    if (StudentUid !== "" && DayNum !== "") {
      let $tag = $(event.currentTarget).closest("td");
      $tag.addClass("available");
      $tag.find('a[name="cross"]').removeClass("show");
      $tag.find('a[name="check"]').addClass("show");

      let Controls = this.MonthlyAttendanceData.get("AttendaceDetail")[
        "controls"
      ];
      let index = 0;
      let CurrentStudent: FormGroup = null;
      while (index < Controls.length) {
        if (Controls[index].controls.StudentUid.value === StudentUid) {
          CurrentStudent = Controls[index];
          CurrentStudent.get("Day" + DayNum).setValue(true);
          break;
        }
        index++;
      }
    } else {
      this.commonService.ShowToast(
        "Invalid student selected. Please contact to admin."
      );
    }
  }

  HandleAbsentAttendace(StudentUid: string, DayNum: string) {
    if (StudentUid !== "" && DayNum !== "") {
      let $tag = $(event.currentTarget).closest("td");
      $tag.removeClass("available");
      $tag.find('a[name="cross"]').addClass("show");
      $tag.find('a[name="check"]').removeClass("show");

      let Controls = this.MonthlyAttendanceData.get("AttendaceDetail")[
        "controls"
      ];
      let index = 0;
      let CurrentStudent: FormGroup = null;
      while (index < Controls.length) {
        if (Controls[index].controls.StudentUid.value === StudentUid) {
          CurrentStudent = Controls[index];
          CurrentStudent.get("Day" + DayNum).setValue(false);
          break;
        }
        index++;
      }
    } else {
      this.commonService.ShowToast(
        "Invalid student selected. Please contact to admin."
      );
    }
  }

  BuildStudentAttendanceDetail(
    AttendanceData: AttendanceSheetModal
  ): FormGroup {
    return new FormGroup({
      StudentUid: new FormControl(AttendanceData.StudentUid),
      StudentName: new FormControl(
        `${AttendanceData.FirstName} ${AttendanceData.LastName}`
      ),
      ClassDetailUid: new FormControl(AttendanceData.ClassDetailUid),
      Class: new FormControl(AttendanceData.Class),
      Section: new FormControl(AttendanceData.Section),
      Date: new FormControl(new Date()),
      AttendanceUid: new FormControl(AttendanceData.AttendanceUid),
      RollNo: new FormControl(AttendanceData.RollNo),
      AttendanceMonth: new FormControl(AttendanceData.AttendanceMonth),
      AttendanceYear: new FormControl(AttendanceData.AttendanceYear),
      Day1: new FormControl(
        AttendanceData.Day1 === null || AttendanceData.Day1 === 0 ? false : true
      ),
      Day2: new FormControl(
        AttendanceData.Day2 === null || AttendanceData.Day2 === 0 ? false : true
      ),
      Day3: new FormControl(
        AttendanceData.Day3 === null || AttendanceData.Day3 === 0 ? false : true
      ),
      Day4: new FormControl(
        AttendanceData.Day4 === null || AttendanceData.Day4 === 0 ? false : true
      ),
      Day5: new FormControl(
        AttendanceData.Day5 === null || AttendanceData.Day5 === 0 ? false : true
      ),
      Day6: new FormControl(
        AttendanceData.Day6 === null || AttendanceData.Day6 === 0 ? false : true
      ),
      Day7: new FormControl(
        AttendanceData.Day7 === null || AttendanceData.Day7 === 0 ? false : true
      ),
      Day8: new FormControl(
        AttendanceData.Day8 === null || AttendanceData.Day8 === 0 ? false : true
      ),
      Day9: new FormControl(
        AttendanceData.Day9 === null || AttendanceData.Day9 === 0 ? false : true
      ),
      Day10: new FormControl(
        AttendanceData.Day10 === null || AttendanceData.Day10 === 0
          ? false
          : true
      ),
      Day11: new FormControl(
        AttendanceData.Day11 === null || AttendanceData.Day11 === 0
          ? false
          : true
      ),
      Day12: new FormControl(
        AttendanceData.Day12 === null || AttendanceData.Day12 === 0
          ? false
          : true
      ),
      Day13: new FormControl(
        AttendanceData.Day13 === null || AttendanceData.Day13 === 0
          ? false
          : true
      ),
      Day14: new FormControl(
        AttendanceData.Day14 === null || AttendanceData.Day14 === 0
          ? false
          : true
      ),
      Day15: new FormControl(
        AttendanceData.Day15 === null || AttendanceData.Day15 === 0
          ? false
          : true
      ),
      Day16: new FormControl(
        AttendanceData.Day16 === null || AttendanceData.Day16 === 0
          ? false
          : true
      ),
      Day17: new FormControl(
        AttendanceData.Day17 === null || AttendanceData.Day17 === 0
          ? false
          : true
      ),
      Day18: new FormControl(
        AttendanceData.Day18 === null || AttendanceData.Day18 === 0
          ? false
          : true
      ),
      Day19: new FormControl(
        AttendanceData.Day19 === null || AttendanceData.Day19 === 0
          ? false
          : true
      ),
      Day20: new FormControl(
        AttendanceData.Day20 === null || AttendanceData.Day20 === 0
          ? false
          : true
      ),
      Day21: new FormControl(
        AttendanceData.Day21 === null || AttendanceData.Day21 === 0
          ? false
          : true
      ),
      Day22: new FormControl(
        AttendanceData.Day22 === null || AttendanceData.Day22 === 0
          ? false
          : true
      ),
      Day23: new FormControl(
        AttendanceData.Day23 === null || AttendanceData.Day23 === 0
          ? false
          : true
      ),
      Day24: new FormControl(
        AttendanceData.Day24 === null || AttendanceData.Day24 === 0
          ? false
          : true
      ),
      Day25: new FormControl(
        AttendanceData.Day25 === null || AttendanceData.Day25 === 0
          ? false
          : true
      ),
      Day26: new FormControl(
        AttendanceData.Day26 === null || AttendanceData.Day26 === 0
          ? false
          : true
      ),
      Day27: new FormControl(
        AttendanceData.Day27 === null || AttendanceData.Day27 === 0
          ? false
          : true
      ),
      Day28: new FormControl(
        AttendanceData.Day28 === null || AttendanceData.Day28 === 0
          ? false
          : true
      ),
      Day29: new FormControl(
        AttendanceData.Day29 === null || AttendanceData.Day29 === 0
          ? false
          : true
      ),
      Day30: new FormControl(
        AttendanceData.Day30 === null || AttendanceData.Day30 === 0
          ? false
          : true
      ),
      Day31: new FormControl(
        AttendanceData.Day31 === null || AttendanceData.Day31 === 0
          ? false
          : true
      ),
    });
  }

  GetAdvanceFilter() {
    if (this.ClassDetailUid !== null && this.ClassDetailUid !== "") {
      this.LoadData();
    } else {
      this.commonService.ShowToast("Please select Class and Section.");
    }
  }

  ResetFilter() {}

  SubmitAttendance() {
    if (IsValidType(this.MonthlyAttendanceData.controls.AttendaceDetail)) {
      let ServerData = this.MonthlyAttendanceData.controls.AttendaceDetail
        .value;
      this.http
        .post("AdminMaster/AddUpdateAttendence", ServerData)
        .then((result) => {
          if (IsValidType(result)) {
            this.commonService.ShowToast(SuccessMessage);
          } else {
            this.commonService.ShowToast(InvalidData);
          }
        });
    } else {
      this.commonService.ShowToast(InvalidData);
    }
  }
}
