import { FormControl, Validators, FormArray } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import {
  CommonService,
  IsValidType,
  IsValidTime,
  IsValidResponse,
} from "src/providers/common-service/common.service";
import { Component, OnInit } from "@angular/core";
import * as $ from "jquery";
import { AjaxService } from "src/providers/ajax.service";
import { FormGroup } from "@angular/forms";
import { ZerothIndex } from "src/providers/constants";

@Component({
  selector: "app-managetimetable",
  templateUrl: "./managetimetable.component.html",
  styleUrls: ["./managetimetable.component.scss"],
})
export class ManagetimetableComponent implements OnInit {
  currentJustify: string = "";
  PeriodsCounts: Array<number> = [];
  PeriodSections: FormGroup;
  get Timing(): FormArray {
    return this.PeriodSections.get("Timing") as FormArray;
  }
  LunchTime: any;
  LunchDurationTime: any;
  EnableSlots: boolean = false;
  EnablePeriods: boolean = false;
  AllPeriodTime: any;
  meridian: boolean = false;
  TimingType: string = "global";
  PageTimeSetting: FormGroup;
  IsEnableTimeSetting: boolean = false;
  ActualPeriods: Array<any> = [];
  TimeSetting: any = {};
  TimingDetailRows: Array<TimingModal> = [];
  RuleBooks: Array<RuleBook> = [];
  constructor(
    private commonService: CommonService,
    private http: AjaxService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.Init();
    this.meridian = true;
    this.LunchTime = { hour: 13, minute: 30 };
    this.LunchDurationTime = { hour: 13, minute: 30 };
    this.currentJustify = "justified";
    let index = 1;
    while (index <= 15) {
      this.PeriodsCounts.push(index);
      index++;
    }
    this.LoadData();
  }

  LoadData() {
    this.http
      .get("Events/GetApplicationSetting")
      .then((result) => {
        let Data = JSON.parse(result.ResponseBody);
        if (IsValidType(Data["SchoolOtherDetail"])) {
          let SchoolOtherDetailData = Data["SchoolOtherDetail"][ZerothIndex];
          let StartTime = this.BuildTime(SchoolOtherDetailData.SchoolStartTime);
          if (
            typeof StartTime["hour"] !== "undefined" &&
            typeof StartTime["minute"] !== "undefined"
          ) {
            this.PeriodSections.get("SchoolStartTime").setValue(
              SchoolOtherDetailData.SchoolStartTime
            );
            $("#starthrs").val(StartTime["hour"]);
            $("#startmins").val(StartTime["minute"]);
          }

          if (IsValidType(Data["Rulebook"])) {
            this.RuleBooks = Data["Rulebook"];
          }

          if (
            SchoolOtherDetailData.SchoolOtherDetailUid !== null &&
            SchoolOtherDetailData.SchoolOtherDetailUid !== ""
          ) {
            this.PeriodSections.get("SchoolOtherDetailUid").setValue(
              SchoolOtherDetailData.SchoolOtherDetailUid
            );

            if (SchoolOtherDetailData.TotalNoOfPeriods !== null)
              this.PeriodSections.get("TotalPeriods").setValue(
                SchoolOtherDetailData.TotalNoOfPeriods
              );

            this.BuildPeriods();

            if (SchoolOtherDetailData.LunchAfterPeriod !== null)
              this.PeriodSections.get("LunchAfterPeriod").setValue(
                SchoolOtherDetailData.LunchAfterPeriod
              );

            let LunchDuration = this.BuildTime(
              SchoolOtherDetailData.LunchBreakDuration
            );
          }
        }

        if (IsValidType(Data["TimingDetail"])) {
          this.TimingDetailRows = Data["TimingDetail"];
          if (IsValidType(this.TimingDetailRows)) {
            this.BindExistingPeriod(this.TimingDetailRows);
          }
        }

        if (IsValidType(Data["Rulebook"])) {
        }
      })
      .catch((err) => {
        this.commonService.ShowToast("Server error. Please contact to admin.");
      });
  }

  BuildTime(data: any) {
    let BuildTime = {};
    try {
      if (IsValidType(data)) {
        if (data.indexOf(":") !== -1) {
          let values = data.split(":");
          if (values.length > 1) {
            BuildTime = {
              hour: parseInt(values[0]),
              minute: parseInt(values[1]),
            };
          }
        }
      }
    } catch (e) {
      BuildTime = {
        hour: 0,
        minute: 0,
      };
    }
    return BuildTime;
  }

  BuildPeriods() {
    let value = this.PeriodSections.get("TotalPeriods").value;
    if (value === "") {
      this.EnablePeriods = false;
      this.commonService.ShowToast("Please selecte valid number.");
    } else {
      try {
        let index = 1;
        let TotalPeriod = parseInt(value);
        while (index <= TotalPeriod) {
          this.ActualPeriods.push(index);
          index++;
        }
        if (TotalPeriod > 0) {
          this.EnablePeriods = true;
        } else {
          this.EnablePeriods = false;
        }
      } catch (e) {
        this.commonService.ShowToast("Invalid period selected.");
      }
    }
  }

  BindExistingPeriod(ExistingPeriods: Array<TimingModal>) {
    try {
      let index = 0;
      const Items = this.PeriodSections.get("Timing") as FormArray;
      while (index < ExistingPeriods.length) {
        Items.push(
          this.GetTimingFormGroup({
            SufixedNumber: ExistingPeriods[index].TimingFor,
            DurationInMin: ExistingPeriods[index].DurationInMin,
            RulebookUid: ExistingPeriods[index].RulebookUid,
            DurationInHrs: ExistingPeriods[index].DurationInHrs,
            TimingFor: ExistingPeriods[index].TimingFor,
            TimingDetailUid: ExistingPeriods[index].TimingDetailUid,
          })
        );
        index++;
      }
      if (Items.length > 0) {
        this.EnableSlots = true;
      } else {
        this.EnableSlots = false;
      }
    } catch (e) {
      this.commonService.ShowToast("Invalid value passed.");
    }
  }

  LunchAfterPeriod() {
    try {
      let LunchPeriod = parseInt(
        this.PeriodSections.get("LunchAfterPeriod").value
      );
      let index = 1;
      const Items = this.PeriodSections.get("Timing") as FormArray;
      let TotalPeriod = parseInt(this.PeriodSections.get("TotalPeriods").value);
      while (index <= TotalPeriod) {
        if (index === LunchPeriod) {
          Items.push(
            this.GetTimingFormGroup({
              SufixedNumber: this.commonService.SufixNumber(index) + " period",
              DurationInMin: 0,
              RulebookUid: "",
              DurationInHrs: 0,
              TimingFor: index.toString(),
              TimingDetailUid: "",
            })
          );

          Items.push(
            this.GetTimingFormGroup({
              SufixedNumber: "Lunch",
              DurationInMin: 0,
              RulebookUid: "",
              DurationInHrs: 0,
              TimingFor: "lunch",
              TimingDetailUid: "",
            })
          );
        } else {
          Items.push(
            this.GetTimingFormGroup({
              SufixedNumber: this.commonService.SufixNumber(index) + " period",
              DurationInMin: 0,
              RulebookUid: "",
              DurationInHrs: 0,
              TimingFor: index.toString(),
              TimingDetailUid: "",
            })
          );
        }
        index++;
      }
      if (Items.length > 0) {
        this.EnableSlots = true;
      } else {
        this.EnableSlots = false;
      }
    } catch (e) {
      this.commonService.ShowToast("Invalid value passed.");
    }
  }

  GetTimingFormGroup(modalData: TimingModal) {
    return this.fb.group({
      SufixedNumber: new FormControl(
        modalData.SufixedNumber,
        Validators.required
      ),
      RulebookUid: new FormControl(modalData.RulebookUid, Validators.required),
      DurationInMin: new FormControl(
        modalData.DurationInMin,
        Validators.required
      ),
      DurationInHrs: new FormControl(
        modalData.DurationInHrs,
        Validators.required
      ),
      TimingFor: new FormControl(modalData.TimingFor, Validators.required),
      TimingDetailUid: new FormControl(
        modalData.TimingDetailUid,
        Validators.required
      ),
    });
  }

  Init() {
    this.PeriodSections = this.fb.group({
      SchoolOtherDetailUid: new FormControl(null),
      SchoolStartTime: new FormControl("", Validators.required),
      TotalPeriods: new FormControl("", Validators.required),
      LunchAfterPeriod: new FormControl("", Validators.required),
      LunchTime: new FormControl("", Validators.required),
      TimingDescription: new FormControl("", Validators.required),
      LunchDuration: new FormControl("", Validators.required),
      TimingFor: new FormControl("", Validators.required),
      RuleName: new FormControl("", Validators.required),
      Timing: this.fb.array([]),
    });
  }

  SelectTimingType() {
    if (this.TimeSetting.TotalPeriods === "") {
      this.commonService.ShowToast("Please select total periods first.");
    }
  }

  SaveSetting() {
    if (!IsValidType(this.PeriodSections.get("SchoolStartTime").value)) {
      this.commonService.ShowToast("Invalid school start time given.");
      return null;
    }

    if (!IsValidType(this.PeriodSections.get("TotalPeriods").value)) {
      this.commonService.ShowToast("Invalid total period.");
      return null;
    }

    if (!IsValidType(this.PeriodSections.get("LunchAfterPeriod").value)) {
      this.commonService.ShowToast("Please select lunch after period.");
      return null;
    }

    let LunchTimeValue = "";
    if (IsValidType(this.PeriodSections.get("Timing").value)) {
      let TimingValues = this.PeriodSections.get("Timing").value;
      let message = "";
      let index = 0;
      let TotalMinutesBeforeLunch: number = 0;
      let IsBeforeLunch = true;
      while (index < TimingValues.length) {
        if (TimingValues[index]["DurationInHrs"] === "") {
          if (message === "") {
            message = TimingValues[index]["DurationInHrs"];
          } else {
            message = ", " + TimingValues[index]["DurationInHrs"];
          }
        } else {
          if (TimingValues[index]["SufixedNumber"] === "Lunch") {
            IsBeforeLunch = false;
            this.PeriodSections.get("LunchDuration").setValue(
              TimingValues[index]["DurationInHrs"] +
                ":" +
                TimingValues[index]["DurationInMin"]
            );
          }

          if (IsBeforeLunch) {
            TotalMinutesBeforeLunch +=
              parseInt(TimingValues[index]["DurationInHrs"]) * 60 +
              parseInt(TimingValues[index]["DurationInMin"]);
          }
        }
        index++;
      }

      if (TotalMinutesBeforeLunch > 0) {
        LunchTimeValue = this.GetLunchBreakTime(
          this.PeriodSections.get("SchoolStartTime").value,
          TotalMinutesBeforeLunch
        );
      } else {
        this.commonService.ShowToast("Invalid lunch time selected.");
        return null;
      }

      if (message !== "") {
        this.commonService.ShowToast("Invalid periods: " + message);
        return null;
      }
    }

    let TimingObjectValue = this.GetTimingObject(
      this.PeriodSections.controls.Timing.value
    );

    let IsUpdateform = false;
    if (this.RuleBooks.length === 0) {
      this.RuleBooks = this.BuildRuleBook();
    } else {
      IsUpdateform = true;
    }

    if (TimingObjectValue.length > 0) {
      let ServerObject = {
        SchoolOtherDetailUid: this.PeriodSections.get("SchoolOtherDetailUid")
          .value,
        SchoolStartTime: this.PeriodSections.get("SchoolStartTime").value,
        LunchTime: LunchTimeValue,
        LunchDuration: this.PeriodSections.get("LunchDuration").value,
        TotalPeriods: parseInt(this.PeriodSections.get("TotalPeriods").value),
        LunchAfterPeriod: parseInt(
          this.PeriodSections.get("LunchAfterPeriod").value
        ),
        TimingDescription: "Daily routine timetable detail.",
        TimingDetails: TimingObjectValue,
        RuleBookDetail: this.RuleBooks,
        IsUpdate: IsUpdateform,
      };

      this.http
        .post("Events/ApplicationTimeSetting", ServerObject)
        .then((result) => {
          if (result.ResponseBody === "Inserted successfully") {
            this.commonService.ShowToast(result.ResponseBody);
          }
        })
        .catch((err) => {
          this.commonService.ShowToast(
            "Server error. Please contact to admin."
          );
        });
    }
  }

  BuildRuleBook(): Array<RuleBook> {
    let RuleBookDetail = [
      {
        RulebookUid: null,
        RuleCode: 1,
        RuleName: "timetable",
      },
      {
        RulebookUid: null,
        RuleCode: 2,
        RuleName: "lunch",
      },
    ];
    return RuleBookDetail;
  }

  GetTimingObject(Data: any) {
    let TimingObject: Array<any> = [];
    let flag = false;
    if (this.TimingDetailRows.length > 0) flag = true;
    if (IsValidType(Data)) {
      let index = 0;
      while (index < Data.length) {
        TimingObject.push({
          RulebookUid: flag ? this.TimingDetailRows[index].RulebookUid : "",
          TimingFor: flag
            ? this.TimingDetailRows[index].TimingFor
            : Data[index].TimingFor,
          TimingDetailUid: flag
            ? this.TimingDetailRows[index].TimingDetailUid
            : new Date().getTime().toString(),
          DurationInHrs: parseInt(Data[index].DurationInHrs),
          DurationInMin: parseInt(Data[index].DurationInMin),
        });
        index++;
      }
    }
    return TimingObject;
  }

  GetLunchBreakTime(StartTime: string, TotalMinutes: number): string {
    let ActualTimeValue = "";
    let TimeValue = StartTime.split(":");
    if (TimeValue.length === 2) {
      ActualTimeValue = "";
      let Hrs = parseInt(TimeValue[0]) * 60;
      let Min = parseInt(TimeValue[1]);
      let StartMinutes = Hrs + Min + TotalMinutes;
      let LunchHr = parseInt((StartMinutes / 60).toString());
      let LunchMin = parseInt((StartMinutes % 60).toString());
      ActualTimeValue = LunchHr.toString() + ":" + LunchMin.toString();
    }
    return ActualTimeValue;
  }

  GlobalHourSetting($e: any) {
    if (this.PeriodSections.controls.Timing.value.length > 0) {
      let ControlValue = this.PeriodSections.controls.Timing.value;
      let index = 0;
      while (index < ControlValue.length) {
        ControlValue[index].DurationInHrs = $(event.currentTarget).val();
        index++;
      }
      this.PeriodSections.controls["Timing"].setValue(ControlValue);
    }
  }

  GlobalMinuteSetting($e: any) {
    if (this.PeriodSections.controls.Timing.value.length > 0) {
      let ControlValue = this.PeriodSections.controls.Timing.value;
      let index = 0;
      while (index < ControlValue.length) {
        ControlValue[index].DurationInMin = $(event.currentTarget).val();
        index++;
      }
      this.PeriodSections.controls["Timing"].setValue(ControlValue);
    }
  }

  SetStartHours() {
    let value = $(event.currentTarget).val().trim();
    if (value !== null && value !== "") {
    }
  }

  SetStartMinutes() {
    let value = $(event.currentTarget).val().trim();
    let hrsvalue = $("#starthrs").val().trim();
    try {
      if (hrsvalue !== null && hrsvalue !== "") {
        let HrsIntvalue = parseInt(hrsvalue);
        if (HrsIntvalue <= 0) {
          this.commonService.ShowToast("Invalid school start time hrs.");
        }
        if (value !== null && value !== "") {
          let Intvalue = parseInt(value);
          this.PeriodSections.get("SchoolStartTime").setValue(
            HrsIntvalue.toString() + ":" + Intvalue.toString()
          );
        }
      }
    } catch (e) {
      this.commonService.ShowToast("Invalid school start time.");
    }
  }
}

interface SettingFrom {
  TimingSetting: TimeSettingModal;
  Timings: FormArray;
}

class TimeSettingModal {
  SchoolStartTime: any;
  TotalPeriods: string = "";
  LunchAfterPeriod: string = "";
  LunchTime: any;
  TimingDescription: string = "";
  LunchDuration: any;
  RuleName: string = "";
}

class TimingModal {
  SufixedNumber: string;
  TimingDetailUid: string = "";
  RulebookUid: string = "";
  TimingFor: string = "";
  DurationInHrs: number = 0;
  DurationInMin: number = 0;
}

interface RuleBook {
  RulebookUid: string;
  RuleCode: number;
  RuleName: string;
}
