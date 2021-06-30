import { FormControl, Validators, FormArray } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import {
  CommonService,
  IsValidType,
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
    let timingValue = this.PeriodSections.get("Timing") as FormArray;
    return timingValue;
  }
  LunchTime: any;
  LunchDurationTime: any;
  EnableSlots: boolean = false;
  EnablePeriods: boolean = false;
  AllPeriodTime: any;
  meridian: boolean = false;
  TimingType: string = "global";
  IsEnableTimeSetting: boolean = false;
  ActualPeriods: Array<any> = [];
  TimeSetting: any = {};
  TimingDetailRows: Array<TimingModal> = [];
  RuleBooks: Array<RuleBook> = [];
  TimingArray: Array<string> = [];
  popoverelem: any = null;
  newtime: string = "";
  isUpdateTime: boolean = false;
  updatingIndex: number = 0;
  newDuration: number = 50;
  isTimingReady: boolean = false;
  isEditMode: boolean = false;
  TimingDisplayModel: DisplayModel = null;

  constructor(
    private commonService: CommonService,
    private http: AjaxService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.popoverelem = $('#menu-dv');
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
        if(result.ResponseBody == null){
          return null;
        }

        let Data = result.ResponseBody;
        if (Data["SchoolOtherDetail"] !== null) {
          let SchoolOtherDetailData = Data["SchoolOtherDetail"][ZerothIndex];
          let StartTime = this.BuildTime(SchoolOtherDetailData.SchoolStartTime);
          if (StartTime["hour"] > -1 && StartTime["minute"] > -1) {
            this.PeriodSections.get("SchoolStartTime").setValue(
              SchoolOtherDetailData.SchoolStartTime
            );
            $("#starthrs").val(StartTime["hour"]);
            $("#startmins").val(StartTime["minute"]);
          }

          if (IsValidType(Data["Rulebook"])) {
            this.RuleBooks = Data["Rulebook"];
          }

          if (SchoolOtherDetailData.SchoolOtherDetailUid !== null 
              && SchoolOtherDetailData.SchoolOtherDetailUid !== "") {

            this.PeriodSections.get("SchoolOtherDetailUid").setValue(
              SchoolOtherDetailData.SchoolOtherDetailUid
            );

            if (SchoolOtherDetailData.TotalNoOfPeriods !== null) {
              this.PeriodSections.get("TotalPeriods").setValue(
                SchoolOtherDetailData.TotalNoOfPeriods
              );
            }

            if (SchoolOtherDetailData.TotalNoOfPeriods !== null) {
              this.PeriodSections.get("PeriodsDuration").setValue(
                40
              );
            }

            if (SchoolOtherDetailData.TotalNoOfPeriods !== null) {
              this.PeriodSections.get("LunchDuration").setValue(
                SchoolOtherDetailData.LunchBreakDuration
              );
            }

            this.BuildPeriods();

            if (SchoolOtherDetailData.LunchAfterPeriod !== null)
              this.PeriodSections.get("LunchAfterPeriod").setValue(
                SchoolOtherDetailData.LunchAfterPeriod
              );
          }
        }

        this.TimingDetailRows = Data["TimingDetail"];
        if (IsValidType(this.TimingDetailRows)) {
          this.GeneratePeriods();
        }
      })
      .catch((err) => {
        this.commonService.ShowToast("Server error. Please contact to admin.");
      });
  }

  BuildTime(data: any) {
    let BuildTime = {
      hour: -1,
      minute: -1,
    };
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
        hour: -1,
        minute: -1,
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

  // BindExistingPeriod(ExistingPeriods: Array<TimingModal>) {
  //   try {
  //     let index = 0;
  //     const Items = this.PeriodSections.get("Timing") as FormArray;
  //     while (index < ExistingPeriods.length) {
  //       Items.push(
  //         this.GetTimingFormGroup({
  //           Period: ExistingPeriods[index].Period,
  //           SufixedNumber: ExistingPeriods[index].TimingFor,
  //           DurationInMin: ExistingPeriods[index].DurationInMin,
  //           RulebookUid: ExistingPeriods[index].RulebookUid,
  //           DurationInHrs: ExistingPeriods[index].DurationInHrs,
  //           LunchDuration: ExistingPeriods[index].DurationInHrs,
  //           TimingFor: ExistingPeriods[index].TimingFor,
  //           TimingDetailUid: ExistingPeriods[index].TimingDetailUid,
  //           MeridianTime: ExistingPeriods[index].MeridianTime,
  //           StandardTime: ExistingPeriods[index].StandardTime,
  //           TimingArray: ExistingPeriods[index].TimingArray
  //         })
  //       );
  //       index++;
  //     }
  //     if (Items.length > 0) {
  //       this.EnableSlots = true;
  //       this.isTimingReady = true;
  //     } else {
  //       this.EnableSlots = false;
  //     }
  //   } catch (e) {
  //     this.commonService.ShowToast("Invalid value passed.");
  //   }
  // }

  FindPeriodTime(currntHour: number, currntMinute: number, durationHrs: number, durationMin: number) {
    let newTime = {
      hour: 0,
      minute: 0,
      periodMeridian: 'AM',
      standartTime: ''
    };

    let totalMin = (currntHour + durationHrs) * 60 + currntMinute + durationMin;
    let standardHour = Math.floor(totalMin / 60);
    let standardMinute = Math.floor(totalMin % 60);
    newTime.standartTime = `${standardHour}:${standardMinute}`;
    if(totalMin > 720) {
      let nextMinutes: number = totalMin - 720;
      newTime.hour = Math.floor(nextMinutes / 60);
      newTime.minute = Math.floor(nextMinutes % 60);
      newTime.periodMeridian = 'PM';
    } else {
      newTime.hour = Math.floor(totalMin / 60);
      newTime.minute = Math.floor(totalMin % 60);
      newTime.periodMeridian = 'AM';
    }

    return newTime;
  }

  updateTime() {
    this.isUpdateTime = true;
    this.isTimingReady = false;
    this.GeneratePeriods();
  }

  GeneratePeriods() {
    try {
      this.TimingDisplayModel = new DisplayModel();
      let startTime = this.PeriodSections.get("SchoolStartTime").value;
      this.TimingDisplayModel.StartTime = startTime;
      let totalPeriods = this.PeriodSections.get("TotalPeriods").value;
      this.TimingDisplayModel.TotalPeriod = totalPeriods;
      let lunchAfterPeriod = this.PeriodSections.get("LunchAfterPeriod").value;
      this.TimingDisplayModel.LunchAfter = lunchAfterPeriod;
      let periodDuration = this.PeriodSections.get("PeriodsDuration").value;
      let lunchDuration = this.PeriodSections.get("LunchDuration").value;
      if(startTime !== "" && totalPeriods !== "" && lunchAfterPeriod !== "" && periodDuration !== "" && lunchDuration !== "") {
        lunchDuration = parseInt(lunchDuration);
        let schoolStartTime = startTime.split(":");
        if(periodDuration !== "" && schoolStartTime.length == 2) {
          let hours = 0;
          let mins = parseInt(periodDuration);
          let starthours = parseInt(schoolStartTime[0]);
          let startmins = parseInt(schoolStartTime[1]);
          let LunchPeriod = parseInt(lunchAfterPeriod);
          let index = 1;
          let UpdatedTimingArray: FormArray = this.PeriodSections.get("Timing") as FormArray;
          UpdatedTimingArray.clear();
          let TotalPeriod = parseInt(this.PeriodSections.get("TotalPeriods").value);
          let startPeriodState: any = null;
          let extraLunchPeriod = 0;
          let endHour = 0;
          let endMin = 0;
          let endPeriodState: any = null;
          while (index <= (TotalPeriod + 1)) {
            if (index === (LunchPeriod + 1)) {
              endPeriodState = this.FindPeriodTime(starthours, startmins, 0, lunchDuration);
              startPeriodState = this.FindPeriodTime(starthours, startmins, 0, 0);
              endHour = endPeriodState.hour;
              endMin = endPeriodState.minute;
            } else {
              if(this.isUpdateTime && this.updatingIndex == (index - extraLunchPeriod)) 
                endPeriodState = this.FindPeriodTime(starthours, startmins, hours, Number(this.newDuration));
              else
                endPeriodState = this.FindPeriodTime(starthours, startmins, hours, mins);
              startPeriodState = this.FindPeriodTime(starthours, startmins, 0, 0);
              endHour = endPeriodState.hour;
              endMin = endPeriodState.minute;
            }
            if (index === (LunchPeriod + 1)) {
              extraLunchPeriod = 1;
              UpdatedTimingArray.push(
                this.GetTimingFormGroup({
                  Period: -1,
                  SufixedNumber: "Lunch Break",
                  DurationInMin: mins,
                  RulebookUid: "",
                  DurationInHrs: hours,
                  LunchDuration: lunchDuration,
                  TimingFor: "lunch",
                  TimingDetailUid: "",
                  MeridianTime: `${starthours}:${startmins} ${startPeriodState.periodMeridian} to 
                                ${endHour}:${endMin} ${endPeriodState.periodMeridian}`,
                  StandardTime: endPeriodState.standartTime,
                  TimingArray: this.BuildTimingArray("0", "0"),
                })
              );
              
              this.TimingDisplayModel.LunchStartTime = `${starthours}:${startmins} ${startPeriodState.periodMeridian}`;
              this.TimingDisplayModel.LunchBreakDuration = lunchDuration;
            } else {
                UpdatedTimingArray.push(
                this.GetTimingFormGroup({
                  Period: (index - extraLunchPeriod),
                  SufixedNumber: this.commonService.SufixNumber(index - extraLunchPeriod) + " period",
                  DurationInMin: mins,
                  RulebookUid: "",
                  DurationInHrs: hours,
                  LunchDuration: lunchDuration,
                  TimingFor: (index - extraLunchPeriod).toString(),
                  TimingDetailUid: "",
                  MeridianTime: `${starthours}:${startmins} ${startPeriodState.periodMeridian} to 
                                  ${endHour}:${endMin} ${endPeriodState.periodMeridian}`,
                  StandardTime: endPeriodState.standartTime,
                  TimingArray: this.BuildTimingArray("0", "0"),
                })
              );
            }

            starthours = endHour;
            startmins = endMin;
            index++;
          }
        } else {
          this.commonService.ShowToast("Invalid duration selected.");
        }
      } else {
        this.commonService.ShowToast("All fields are mandatory.");
      }
    } catch (e) {
      this.commonService.ShowToast("Invalid value passed.");
    } finally {
      this.isUpdateTime = false;
      this.isTimingReady = true;
    }
  }

  BuildTimingArray(startTime: string, lastTime: string): Array<string> {
    let times: Array<string> = [];
    this.TimingArray = [];
    return times;
  }

  GetTimingFormGroup(modalData: TimingModal) {
    return this.fb.group({
      Period: modalData.Period,
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
      LunchDuration: new FormControl(
        modalData.LunchDuration,
        Validators.required
      ),
      TimingFor: new FormControl(modalData.TimingFor, Validators.required),
      TimingDetailUid: new FormControl(
        modalData.TimingDetailUid,
        Validators.required
      ),
      MeridianTime: new FormControl(modalData.MeridianTime, Validators.required),
      StandardTime: new FormControl(modalData.StandardTime, Validators.required),
    });
  }

  Init() {
    this.PeriodSections = this.fb.group({
      SchoolOtherDetailUid: new FormControl(""),
      SchoolStartTime: new FormControl("", Validators.required),
      TotalPeriods: new FormControl("", Validators.required),
      PeriodsDuration: new FormControl("", Validators.required),
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
    let LunchTimeValue = "";
    if (this.PeriodSections.get("Timing").value !== null) {
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
        let LunchTimingModal = this.PeriodSections.value.Timing.filter(x=>x.Period === -1);
        if(LunchTimingModal.length > 0) {
          let MaridianTime = LunchTimingModal[0].MeridianTime;
          LunchTimeValue = MaridianTime.split("to")[0].trim().replace(/AM/g, '').replace(/PM/g, '').trim();
        }
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
        PeriodDurationInMinutes: parseInt(this.PeriodSections.get("PeriodsDuration").value),
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
        });
    }
  }

  BuildRuleBook(): Array<RuleBook> {
    let RuleBookDetail = [
      {
        RulebookUid: null,
        RuleCode: 0,
        RuleName: "school timings",
      }
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

  getActionPopover(elem: any, period: number) {
    this.updatingIndex = period;
    let xAxisWidth = elem.x;
    let winWidth = window.innerWidth;
    let boxWidth = this.popoverelem.width();
    let boxHeight = this.popoverelem.height();
    let left = elem.pageX;
    var top = elem.pageY;

    if(winWidth - xAxisWidth > 300) {
      this.popoverelem.css({'left': left + 20, 'top': top - boxHeight * .4});
    } else {
      this.popoverelem.css({'left': (left - (boxWidth + 20)), 'top': top - boxHeight * .4});
    }
    this.popoverelem.removeClass('d-none');
  }

  closePopover() {
    this.newtime = "";
    this.popoverelem.addClass('d-none');
  }

  enableEditing() {
    this.isTimingReady = !this.isTimingReady;
    this.isEditMode = !this.isEditMode;
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
  Period: number = 0;
  SufixedNumber: string;
  TimingDetailUid: string = "";
  RulebookUid: string = "";
  TimingFor: string = "";
  DurationInHrs: number = 0;
  LunchDuration: number = 0;
  DurationInMin: number = 0;
  MeridianTime: string = '';
  StandardTime: string = '';
  TimingArray: Array<string> = [];
}

interface RuleBook {
  RulebookUid: string;
  RuleCode: number;
  RuleName: string;
}

class DisplayModel {
  StartTime: string = "";
  LunchStartTime: string = "";
  TotalPeriod: number = 0;
  LunchAfter: number = 0;
  PeriodDuration: number = 0;
  LunchBreakDuration: number = 0;
}