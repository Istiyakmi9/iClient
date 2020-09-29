import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { ApplicationStorage } from "src/providers/ApplicationStorage";
import { Component, OnInit } from "@angular/core";
import { AjaxService } from "src/providers/ajax.service";
import {
  CommonService,
  IsValidType,
} from "src/providers/common-service/common.service";
import {
  ServerError,
  ZerothIndex,
  OperationFail,
  InvalidData,
} from "src/providers/constants";
import * as $ from "jquery";
import { ClassDetail } from "src/app/app.component";

@Component({
  selector: "app-timetable",
  templateUrl: "./timetable.component.html",
  styleUrls: ["./timetable.component.scss"],
})
export class TimetableComponent implements OnInit {
  TimetableDetail: Array<TimetableModal> = [];
  TotalPeriods: number = 8;
  LunchBreakAfter: number = 4;
  WorkingDays: number = 6;
  IsReady: boolean = false;
  LunchAfterPeriod: number = 4;
  EnablePopup: boolean = false;
  ClassDetail: Array<ClassDetail>;
  IsEnableSection: boolean;
  Classes: Array<string>;
  Sections: Array<ClassDetail>;
  FacultyWithSubjects: Array<FacultyWithSubjectsModal> = [];
  RoutineTable: Array<any> = [];
  Faculties: Array<any> = [];
  Subjects: Array<any> = [];
  SchoolTimetableDetail: SchoolTimetableDetailModal;
  SubjectDetail: any;
  AssignFaculty: FormGroup;
  CurrentClassDetailUid: string;
  SelecteClass: string;
  WeekDaysName: Array<any> = [
    { Num: 1, Name: "Mon" },
    { Num: 2, Name: "Tue" },
    { Num: 3, Name: "Wed" },
    { Num: 4, Name: "Thu" },
    { Num: 5, Name: "Fri" },
    { Num: 6, Name: "Sat" },
  ];
  TimingDetail: Array<TimingDetailModal> = [];
  constructor(
    private http: AjaxService,
    private commonService: CommonService,
    private storage: ApplicationStorage,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.IsEnableSection = true;
    this.CurrentClassDetailUid = "";
    this.AssignFaculty = this.fb.group({
      FacultyUid: new FormControl("", Validators.required),
      SubjectUid: new FormControl("", Validators.required),
      ClassDetailUid: new FormControl("", Validators.required),
      TimetableUid: new FormControl("", Validators.required),
      RulebookUid: new FormControl("", Validators.required),
      SubstitutedFacultiUid: new FormControl("", Validators.required),
      Period: new FormControl("", Validators.required),
      WeekDayNum: new FormControl("", Validators.required),
    });
    this.ClassDetail = this.storage.GetClassDetail();
    this.SubjectDetail = [];
    let Subjects = this.storage.get(null, "Subject");
    if (IsValidType(Subjects)) {
      Subjects.map((item) => {
        this.SubjectDetail.push({
          value: item.SubjectId,
          text: item.subjectName,
        });
      });
      this.SubjectDetail;
    }
    this.Classes = this.storage.GetClasses();
    this.SelectDefault();
  }

  SelectDefault() {
    if (IsValidType(this.ClassDetail)) {
      let FirstItem = this.ClassDetail[ZerothIndex];
      this.BindSections(FirstItem.Class);
      this.SelecteClass = FirstItem.Class;
      this.CurrentClassDetailUid = FirstItem.ClassDetailUid;
      this.LoadInitData();
    }
  }

  AssignChanges() {
    let Error = [];
    if (!IsValidType(this.AssignFaculty.get("FacultyUid").value)) {
      Error.push("FacultyUid");
    }

    if (!IsValidType(this.AssignFaculty.get("SubjectUid").value)) {
      Error.push("SubjectUid");
    }

    if (!IsValidType(this.CurrentClassDetailUid)) {
      Error.push("ClassDetailUid");
    } else {
      this.AssignFaculty.get("ClassDetailUid").setValue(
        this.CurrentClassDetailUid
      );
    }

    if (Error.length > 0) {
      this.commonService.ShowToast(
        "All fields are required. Please fill all fields before submit."
      );
    } else {
      this.Close();
      this.http
        .post("Events/AllocateSubject", this.AssignFaculty.value)
        .then((result) => {
          if (result.ResponseBody !== "" && result.ResponseBody !== null) {
            this.ManagePage(result);
          } else {
            this.commonService.ShowToast(OperationFail);
          }
        })
        .catch((err) => {
          this.commonService.ShowToast(OperationFail);
        });
    }
  }

  GetTimetableData() {
    this.LoadInitData();
  }

  LoadInitData() {
    this.http
      .get(`Events/GetTimetable?ClassDetailUid=${this.CurrentClassDetailUid}`)
      .then((result) => {
        if (IsValidType(result)) {
          this.ManagePage(result);
        }
      })
      .catch((err) => {
        this.commonService.ShowToast(ServerError);
      });
  }

  ManagePage(result: any) {
    let Data = JSON.parse(result.ResponseBody);
    if (typeof Data["SchoolTimetableDetail"] !== "undefined") {
      if (Data["SchoolTimetableDetail"].length > 0) {
        this.SchoolTimetableDetail = Data["SchoolTimetableDetail"][ZerothIndex];

        if (typeof Data["TimingDetail"] !== "undefined") {
          this.BuildTimeDetail(Data["TimingDetail"]);
        }

        if (typeof Data["TimetableInfo"] !== "undefined") {
          this.BuildTimetableInfo(Data["TimetableInfo"], Data["TimingDetail"]);
        }

        if (typeof Data["FacultyWithSubjectDetail"] !== "undefined") {
          this.FacultyWithSubjects = Data["FacultyWithSubjectDetail"];
        }
        this.IsReady = true;
      } else {
        this.commonService.ShowToast(InvalidData);
      }
    } else {
      this.commonService.ShowToast(InvalidData);
    }
  }

  BuildTimeDetail(TimeDetailObject: any) {
    let index = 0;
    this.TimingDetail = [];
    while (index < TimeDetailObject.length) {
      if (this.SchoolTimetableDetail.LunchAfterPeriod === index) {
        let LunchTimingDetail = TimeDetailObject.filter(
          (x) => x.RuleName === "lunch"
        );
        if (LunchTimingDetail.length > 0) {
          LunchTimingDetail = LunchTimingDetail[ZerothIndex];
          this.TimingDetail.push({
            TimingDetailUid: LunchTimingDetail.TimingDetailUid,
            RulebookUid: LunchTimingDetail.RulebookUid,
            RuleName: LunchTimingDetail.RuleName,
            TimingFor: "R",
            RuleCode: LunchTimingDetail.RuleCode,
            DurationInHrs: LunchTimingDetail.DurationInHrs,
            DurationInMin: LunchTimingDetail.DurationInMin,
          });
        }
      }

      if (TimeDetailObject[index].RuleName !== "lunch") {
        this.TimingDetail.push({
          TimingDetailUid: TimeDetailObject[index].TimingDetailUid,
          RulebookUid: TimeDetailObject[index].RulebookUid,
          RuleName: TimeDetailObject[index].RuleName,
          TimingFor: TimeDetailObject[index].TimingFor,
          RuleCode: TimeDetailObject[index].RuleCode,
          DurationInHrs: TimeDetailObject[index].DurationInHrs,
          DurationInMin: TimeDetailObject[index].DurationInMin,
        });
      }
      index++;
    }
  }

  BuildTimetableInfo(TimetableInfo: any, TimeDetailObject: any) {
    let index = 0;
    this.RoutineTable = [];
    let InfoDetail = null;
    let RoutineData: Array<any> = [];
    let CurrentPeriod: number = 0;
    let LuncTime: any;
    while (index < this.WeekDaysName.length) {
      RoutineData = [];
      LuncTime = {};
      let innerIndex = 0;
      while (innerIndex < TimeDetailObject.length) {
        if (innerIndex === 0) {
          RoutineData.push({
            FacultyUid: "",
            Period: -1,
            SubjectUid: "",
            SubjectName: this.WeekDaysName[index].Name,
            FacultyName: "",
            TimetableUid: "",
            RulebookUid: TimeDetailObject[innerIndex].RulebookUid,
          });
        }
        if (TimeDetailObject[innerIndex].TimingFor === "lunch") {
          LuncTime = {
            FacultyUid: "",
            Period: 0,
            SubjectUid: "",
            SubjectName: "L",
            FacultyName: "",
            TimetableUid: "",
            RulebookUid: TimeDetailObject[innerIndex].RulebookUid,
          };
        } else {
          CurrentPeriod = parseInt(
            index + 1 + TimeDetailObject[innerIndex].TimingFor
          );
          InfoDetail = TimetableInfo.filter(
            (x) =>
              x.WeekDayNum.toString() + x.Period.toString() ===
              CurrentPeriod.toString()
          );
          if (InfoDetail.length > 0) {
            InfoDetail = InfoDetail[ZerothIndex];
            RoutineData.push({
              FacultyUid: InfoDetail.FacultyUid,
              Period: CurrentPeriod,
              SubjectUid: InfoDetail.SubjectUid,
              SubjectName: InfoDetail.SubjectName,
              TimetableUid: InfoDetail.TimetableUid,
              FacultyName: `${InfoDetail.FirstName} ${InfoDetail.LastName}`,
              RulebookUid: TimeDetailObject[innerIndex].RulebookUid,
            });
          } else {
            RoutineData.push({
              FacultyUid: "",
              Period: CurrentPeriod,
              TimetableUid: "",
              SubjectUid: null,
              SubjectName: "No Sub",
              FacultyName: "Not alloted",
              RulebookUid: TimeDetailObject[innerIndex].RulebookUid,
            });
          }
        }
        innerIndex++;
      }
      RoutineData.splice(
        this.SchoolTimetableDetail.LunchAfterPeriod + 1,
        0,
        LuncTime
      );
      this.RoutineTable.push({ Data: RoutineData });
      index++;
    }
  }

  OpenSubjectSelection(CurrentObject: any) {
    if (IsValidType(CurrentObject)) {
      let Period = CurrentObject.Period % 10;
      let WeakNum = parseInt((CurrentObject.Period / 10).toString());
      this.AssignFaculty.get("Period").setValue(Period);
      this.AssignFaculty.get("WeekDayNum").setValue(WeakNum);
      this.AssignFaculty.get("RulebookUid").setValue(CurrentObject.RulebookUid);
      this.AssignFaculty.get("TimetableUid").setValue(
        CurrentObject.TimetableUid
      );
      this.EnablePopup = true;
    }
  }

  Close() {
    this.EnablePopup = false;
  }

  EnableSection() {
    this.Sections = [];
    let Class = $(event.currentTarget).val();
    if (IsValidType(Class)) {
      this.BindSections(Class);
    } else {
      document.getElementById("section").setAttribute("disabled", "disabled");
    }
  }

  BindSections(Class) {
    this.IsEnableSection = false;
    if (IsValidType(Class)) {
      this.Sections = this.ClassDetail.filter((x) => x.Class === Class);
      if (this.Sections.length === 0) {
        this.commonService.ShowToast("Unable to load class detail.");
      }
    }
  }

  OnSubjectSelected(value: any) {
    let SelectedValue = JSON.parse(value);
    if (IsValidType(SelectedValue)) {
      this.AssignFaculty.get("SubjectUid").setValue(SelectedValue.value);
      this.GetFacultyBySubject(SelectedValue.value);
    }
  }

  GetFacultyBySubject(SubjectUid: string) {
    if (IsValidType(SubjectUid)) {
      this.Faculties = [];
      let FacultyData = this.FacultyWithSubjects.filter(
        (x) => x.SubjectUid === SubjectUid
      );
      if (FacultyData.length > 0) {
        FacultyData.map((x) => {
          this.Faculties.push({
            value: x.StaffMemberUid,
            text: `${x.FirstName} ${x.LastName}`,
          });
        });
      }

      if (this.Faculties.length === 0) {
        this.commonService.ShowToast("No faculty available for this subject.");
      }
    }
  }

  OnFacultySelected(value: any) {
    let SelectedValue = JSON.parse(value);
    if (IsValidType(SelectedValue)) {
      this.AssignFaculty.get("FacultyUid").setValue(SelectedValue.value);
    }
  }
}

class TimetableModal {
  Day: string = "";
  Subjects: Array<any> = [];
}

interface TimingDetailModal {
  TimingDetailUid: string;
  RulebookUid: string;
  TimingFor: string;
  DurationInHrs: string;
  DurationInMin: string;
  RuleCode: number;
  RuleName: string;
}

interface SchoolTimetableDetailModal {
  SchoolOtherDetailUid: string;
  TotalNoOfPeriods: number;
  SchoolStartTime: string;
  LunchBreakTime: string;
  LunchBreakDuration: string;
  LunchAfterPeriod: number;
  Mon: number;
  Tue: number;
  Wed: number;
  Thu: number;
  Fri: number;
  Sat: number;
  Sun: number;
}

interface FacultyWithSubjectsModal {
  StaffMemberUid: string;
  ClassTeacherForClass: string;
  FirstName: string;
  LastName: string;
  Gender: number;
  Dob: string;
  Doj: string;
  MobileNumber: string;
  AlternetNumber: string;
  SubjectUid: string;
}

interface TimetableAllocationModal {
  TimetableUid: string;
  ClassDetailUid: string;
  RulebookUid: string;
  SubstitutedFacultiUid: string;
  FacultyUid: string;
  SubjectUid: string;
  Period: number;
  WeekDayNum: number;
}
