import { ApplicationStorage } from "./../providers/ApplicationStorage";
import {
  Dashboard,
  Attendence,
  Calendar,
  Contacts,
  FacultyReports,
  Payments,
  QuickRegistration,
  ExamResult,
  StaffRegistration,
  StaffReports,
  StudentRegistration,
  StudentReports,
  Subjects,
  TimeTable,
  TrackOnMap,
  UploadData,
  VehicleLocation,
  ViewClasses,
  StaffMemberRegistration,
  FacultyRegistration,
  ManageTimetable,
  ManageUser,
  Settings,
  AttendanceReport,
  MonthlyAttendance,
  ManageRoles,
  ProgressReport,
  UploadResults,
  ManageResults,
  ManageExam,
  ManageExamDetail,
} from "./../providers/constants";
import { iNavigation } from "./../providers/iNavigation";
import { CommonService } from "./../providers/common-service/common.service";
import { FormGroup } from "@angular/forms";
import { AjaxService } from "src/providers/ajax.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import {
  NavigationEnd,
  NavigationError,
  Router,
  Event,
  NavigationStart,
} from "@angular/router";
import * as $ from "jquery";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "iSchool";
  LoginForm: FormGroup;
  LoginFlag: boolean;
  schoolName: string = "";
  constructor(
    private http: AjaxService,
    private common: CommonService,
    private fb: FormBuilder,
    private nav: iNavigation,
    private router: Router,
    private local: ApplicationStorage
  ) {
    // this.common.HideLoader();
    // this.LoginFlag = this.common.GetLoginStatus();
    // this.LoginForm = this.fb.group({
    //   MobileNo: this.fb.control(""),
    //   Email: this.fb.control(""),
    //   Password: this.fb.control(""),
    //   SchoolTenentId: this.fb.control(""),
    //   UserId: this.fb.control(""),
    //   IsFaculty: this.fb.control(false),
    //   AdminId: this.fb.control(""),
    //   SessionToken: this.fb.control(""),
    // });
    // this.HandleAutoClose();
    // this.router.events.subscribe((event: Event) => {
    //   if (event instanceof NavigationStart) {
    //     //this.LoginFlag = true;
    //     this.common.ShowLoader();
    //     this.common.SetCurrentPageName(event.url.replace("/", ""));
    //     if (event.url === "/" || event.url === "/#/") {
    //       this.LoginFlag = false;
    //     } else {
    //       if (this.local.$master !== null) {
    //         switch (event.url) {
    //           case "/" + "admin/" + Dashboard:
    //             break;
    //           case "/" + ViewClasses:
    //             break;
    //           case "/" + VehicleLocation:
    //             break;
    //           case "/" + UploadData:
    //             break;
    //           case "/" + TrackOnMap:
    //             break;
    //           case "/" + TimeTable:
    //             break;
    //           case "/" + Subjects:
    //             break;
    //           case "/" + StudentReports:
    //             break;
    //           case "/" + StudentRegistration:
    //             break;
    //           case "/" + StaffReports:
    //             break;
    //           case "/" + StaffRegistration:
    //             break;
    //           case "/" + ExamResult:
    //             break;
    //           case "/" + QuickRegistration:
    //             break;
    //           case "/" + Payments:
    //             break;
    //           case "/" + StaffMemberRegistration:
    //             break;
    //           case "/" + FacultyRegistration:
    //             break;
    //           case "/" + FacultyReports:
    //             break;
    //           case "/" + Dashboard:
    //             break;
    //           case "/" + Contacts:
    //             break;
    //           case "/" + Calendar:
    //             break;
    //           case "/" + Attendence:
    //             break;
    //           case "/" + ManageTimetable:
    //             break;
    //           case "/" + ManageUser:
    //             break;
    //           case "/" + Settings:
    //             break;
    //           case "/" + AttendanceReport:
    //             break;
    //           case "/" + MonthlyAttendance:
    //             break;
    //           case "/" + ManageRoles:
    //             break;
    //           case "/" + ProgressReport:
    //             this.common.HighlightNavMenu(ExamResult);
    //             break;
    //           case "/" + UploadResults:
    //             break;
    //           case "/" + ManageResults:
    //             break;
    //           case "/" + ManageExam:
    //             break;
    //           case "/" + ManageExamDetail:
    //             this.common.HighlightNavMenu(ManageExam);
    //             break;
    //           default:
    //             console.log("case not matched");
    //             break;
    //         }
    //       } else {
    //         if (!this.local.reinitMaster()) {
    //           if (event.url !== "/") this.router.navigate(["/"]);
    //         }
    //       }
    //     }
    //   }
    //   if (event instanceof NavigationEnd) {
    //     this.common.HideLoader();
    //   }
    //   if (event instanceof NavigationError) {
    //     this.common.HideLoader();
    //   }
    // });
  }

  HandleAutoClose() {
    window.addEventListener("click", (e: any) => {
      let AutoFillDropdown = document.querySelectorAll(
        'div[name="autofill-header"][active="true"]'
      );
      let index = 0;
      while (index < AutoFillDropdown.length) {
        if (!AutoFillDropdown[index].contains(e.target)) {
          $(AutoFillDropdown[index])
            .find('select[name="autodd"]')
            .addClass("d-none");

          $(AutoFillDropdown[index])
            .find('div[name="autofill-container"]')
            .removeClass("highlight-div");
        }
        index++;
      }
    });
  }

  UserLogin() {
    let FormData = this.LoginForm;
    let ErrorFields = "";
    if (this.common.IsValid(FormData)) {
      if (FormData.get("UserId").value !== "") {
        if (FormData.get("UserId").value.indexOf("@") !== -1) {
          FormData.value.Email = FormData.value.MobileNo;
          FormData.value.MobileNo = "";
        }
      } else {
        ErrorFields = "Mobile/Email";
      }

      if (FormData.get("Password").value === "") {
        if (ErrorFields === "") ErrorFields = "Password is mandatory fields.";
        else ErrorFields += " and Password is mandatory fields.";
      }

      if (ErrorFields === "") {
        this.http
          .post("UserLogin/AuthenticateUser", FormData.value)
          .then((result) => {
            if (this.common.IsValidResponse(result)) {
              this.common.SetLoginStatus(true);
              this.LoginFlag = true;
              this.local.set(JSON.parse(result.ResponseBody));
              this.nav.navigate("admin/" + Dashboard, null);
            } else {
              this.LoginFlag = false;
              this.common.SetLoginStatus(false);
              this.common.ShowToast(result);
            }
          })
          .catch((err) => {
            this.common.ShowToast("Login error.");
            alert(JSON.stringify(err));
          });
      } else {
        this.common.ShowToast(ErrorFields);
      }
    }
  }
}

export interface ClassDetail {
  Index: number;
  ClassDetailUid: string;
  Class: string;
  Available: number;
  Section: string;
  TotalSeats: number;
}
