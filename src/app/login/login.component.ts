import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { AjaxService, resetCookies } from "src/providers/ajax.service";
import { CommonService, IsSuccess, IsValidType } from "src/providers/common-service/common.service";
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
  isSignIn: boolean = true;

  constructor(
    private http: AjaxService,
    private common: CommonService,
    private nav: iNavigation,
    private local: ApplicationStorage,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    resetCookies();
    this.resetForm();  
  }

  resetForm() {
    this.LoginForm = this.fb.group({
      MobileNo: this.fb.control(""),
      Email: this.fb.control(""),
      Password: this.fb.control(""),
      SchoolTenentId: this.fb.control(""),
      UserId: this.fb.control(""),
      IsFaculty: this.fb.control(false),
      AdminId: this.fb.control(""),
      SessionToken: this.fb.control(""),
      Address: this.fb.control(""),
      FullName: this.fb.control(""),
      SchoolName: this.fb.control("")
    });
  }

  flipSignInAdnUp() {
    this.resetForm();
    this.isSignIn = !this.isSignIn;
  }

  UserLogin(){
    if(this.isSignIn)
      this.Login();
    else
      this.SignUp();
  }

  SignUp() {
    let FormData = this.LoginForm;
    let ErrorFields = "";
    if (this.common.IsValid(FormData)) {
      if (FormData.get("MobileNo").value === "") {
        ErrorFields = "MobileNo";
      }

      if (FormData.get("SchoolName").value === "") {
        ErrorFields = "SchoolName";
      }

      if (FormData.get("FullName").value === "") {
        ErrorFields = "FullName";
      }

      if (FormData.get("Address").value === "") {
        ErrorFields = "Address";
      }

      if (ErrorFields === "") {
        this.http
          .post("Registration/NewSignUp", FormData.value, true)
          .then((result) => {
            if(IsSuccess(result)){
             this.common.ShowToast("Registration completed successfully");
             this.flipSignInAdnUp();
            } else {
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

  Login() {
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
              // let cities = this.GetCities(result.ResponseBody["StateNCity"]);
              //let states = this.GetStates(result.ResponseBody["StateNCity"]);
              let masterData = {
                Classes: result.ResponseBody["Classes"],
                ColumnMapping: result.ResponseBody["ColumnMapping"],
                CurrentUser: result.ResponseBody["CurrentUser"],
                Menu: result.ResponseBody["Menu"],
                Roles: result.ResponseBody["Roles"],
                StatesAndCities: result.ResponseBody["StateNCity"],
                Subject: result.ResponseBody["Subject"]
              };
              this.common.SetLoginStatus(true);
              this.local.set(masterData);
              this.nav.navigate(Dashboard, null);
            } else {
              this.common.SetLoginStatus(false);
              this.common.ShowToast(result);
            }
          })
          .catch((err) => {
            this.common.ShowToast("Login error.");
          });
      } else {
        this.common.ShowToast(ErrorFields);
      }
    }
  }
}
