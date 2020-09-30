import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { AjaxService, resetCookies } from "src/providers/ajax.service";
import { CommonService } from "src/providers/common-service/common.service";
import { iNavigation } from "src/providers/iNavigation";
import { ApplicationStorage } from "src/providers/ApplicationStorage";
import { Dashboard } from "src/providers/constants";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  LoginForm: FormGroup;
  schoolName: string = "";

  constructor(
    private http: AjaxService,
    private common: CommonService,
    private nav: iNavigation,
    private local: ApplicationStorage,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    resetCookies();
    this.LoginForm = this.fb.group({
      MobileNo: this.fb.control(""),
      Email: this.fb.control(""),
      Password: this.fb.control(""),
      SchoolTenentId: this.fb.control(""),
      UserId: this.fb.control(""),
      IsFaculty: this.fb.control(false),
      AdminId: this.fb.control(""),
      SessionToken: this.fb.control(""),
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
              //this.LoginFlag = true;
              this.local.set(JSON.parse(result.ResponseBody));
              this.nav.navigate(Dashboard, null);
            } else {
              //this.LoginFlag = false;
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
