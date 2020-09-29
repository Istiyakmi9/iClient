import { AjaxService } from "src/providers/ajax.service";
import { Component, OnInit } from "@angular/core";
import * as $ from "jquery";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { ApplicationStorage } from "src/providers/ApplicationStorage";
import { DefaultUserImage, ZerothIndex } from "src/providers/constants";
import { ClassDetail } from "src/app/app.component";
import {
  CommonService,
  IsValidType,
} from "src/providers/common-service/common.service";
@Component({
  selector: "app-quick-registration",
  templateUrl: "./quick-registration.component.html",
  styleUrls: ["./quick-registration.component.scss"],
})
export class QuickRegistrationComponent implements OnInit {
  studForm: any;
  IsUpdating: boolean;
  IsExistingParent: boolean;
  FacultyImage: any;
  FacultyForm: FormGroup;
  ClassDetail: Array<ClassDetail>;
  SubjectDetail: any;
  Classes: Array<string>;
  Title: string;
  TitleDetail: string;
  FacultyImageType: any;
  Sections: Array<ClassDetail>;
  IsFaculty: boolean = false;
  IsStaff: boolean = false;
  IsStudent: boolean = false;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private storage: ApplicationStorage,
    private http: AjaxService
  ) {}

  ngOnInit() {
    this.ClassDetail = this.storage.GetClassDetail();
    this.FacultyImage = DefaultUserImage;
    this.InitPage();
    this.Title = "Quick Registration";
    this.TitleDetail = "Do registration with minimun information.";
  }

  ClearFields() {
    if ($("#facultyModal") !== null) $("#facultyModal").modal("show");
  }

  EnableSection() {
    this.Sections = [];
    let Class = $(event.currentTarget).val();
    if (IsValidType(Class)) {
      $("#section").removeAttr("disabled");
      this.Sections = this.ClassDetail.filter((x) => x.Class === Class);
      if (this.Sections.length === 0) {
        this.commonService.ShowToast("Unable to load class detail.");
      }
    } else {
      document.getElementById("section").setAttribute("disabled", "disabled");
    }
  }

  ManageCurrent(CurrentType: string) {
    if (CurrentType === "student") {
      this.IsFaculty = false;
      this.IsStaff = false;
      this.IsStudent = true;
    } else if (CurrentType === "faculty") {
      this.IsFaculty = true;
      this.IsStaff = false;
      this.IsStudent = false;
    } else {
      this.IsFaculty = false;
      this.IsStaff = true;
      this.IsStudent = false;
    }
  }

  InitPage() {
    this.SubjectDetail = [
      {
        value: "alsdghalsgh",
        text: "English",
      },
    ];

    this.Classes = this.storage.GetClasses();
    this.FacultyForm = this.fb.group({
      ClassDetailUid: new FormControl("", Validators.required),
      Class: new FormControl("", Validators.required),
      Section: new FormControl("", Validators.required),
      FirstName: new FormControl("", Validators.required),
      LastName: new FormControl("", Validators.required),
      Doj: new FormControl("", Validators.required),
      MobileNumber: new FormControl("", Validators.required),
      ImageUrl: new FormControl("", Validators.required),
      Type: new FormControl("", Validators.required),
      Fatherfullname: new FormControl("", Validators.required),
      Fatherfirstname: new FormControl("", Validators.required),
      Fatherlastname: new FormControl("", Validators.required),
      Motherfullname: new FormControl("", Validators.required),
      Motherfirstname: new FormControl("", Validators.required),
      Motherlastname: new FormControl("", Validators.required),
      Studentfullname: new FormControl("", Validators.required),
      Studentfirstname: new FormControl("", Validators.required),
      Studentlastname: new FormControl("", Validators.required),
    });

    this.ScrollTop();
  }

  ScrollTop() {
    this.commonService.Scrollto($("body"));
  }

  GetFile(fileInput: any) {
    let Files = fileInput.target.files;
    if (Files.length > 0) {
      this.FacultyImageType = <File>Files[0];
      let mimeType = this.FacultyImageType.type;
      if (mimeType.match(/image\/*/) == null) {
        console.log("Only images are supported.");
        return;
      }

      let reader = new FileReader();
      reader.readAsDataURL(this.FacultyImageType);
      reader.onload = (fileEvent) => {
        this.FacultyImage = reader.result;
      };
    } else {
      this.commonService.ShowToast("No file selected");
    }
  }

  GetImage() {
    $("#browsfile").click();
    event.preventDefault();
  }

  GetTwoPartedName(FullName: string) {
    let NameStyle = {
      FirstName: "",
      LastName: "",
    };
    let PartedName = FullName.split(" ");
    if (PartedName.length === 1) {
      NameStyle.FirstName = PartedName[0].trim();
    } else {
      NameStyle.FirstName = PartedName[0];
      let index = 1;
      while (index < PartedName.length) {
        if (NameStyle.LastName === "")
          NameStyle.LastName = PartedName[index].trim();
        else NameStyle.LastName = " " + PartedName[index].trim();
        index++;
      }
    }
    return NameStyle;
  }

  RegisterFaculty() {
    let ErrorFields = [];
    try {
      if (this.IsStudent) {
        if (!IsValidType(this.FacultyForm.get("ClassDetailUid").value)) {
          this.commonService.ShowToast("Class or section is not selected.");
          return null;
        } else {
          let ClassDetailUid = this.FacultyForm.get("ClassDetailUid").value;
          let CurrentSection = this.Sections.filter(
            (x) => x.ClassDetailUid === ClassDetailUid
          );
          if (CurrentSection.length > 0) {
            this.FacultyForm.controls["Section"].setValue(
              CurrentSection[ZerothIndex].Section
            );
            this.FacultyForm.controls["Class"].setValue(
              CurrentSection[ZerothIndex].Class
            );
          } else {
            this.commonService.ShowToast("Class or section is not selected.");
            return null;
          }
        }

        if (!IsValidType(this.FacultyForm.get("Fatherfullname").value)) {
          ErrorFields.push("Fatherfullname");
        } else {
          let NameParts = this.GetTwoPartedName(
            this.FacultyForm.get("Fatherfullname").value
          );
          this.FacultyForm.controls["Fatherfirstname"].setValue(
            NameParts.FirstName
          );
          this.FacultyForm.controls["Fatherlastname"].setValue(
            NameParts.LastName
          );
        }

        if (IsValidType(this.FacultyForm.get("Motherfullname").value)) {
          let NameParts = this.GetTwoPartedName(
            this.FacultyForm.get("Motherfullname").value
          );
          this.FacultyForm.controls["Motherfirstname"].setValue(
            NameParts.FirstName
          );
          this.FacultyForm.controls["Motherlastname"].setValue(
            NameParts.LastName
          );
        }

        if (!IsValidType(this.FacultyForm.get("Studentfullname").value)) {
          ErrorFields.push("Studentfullname");
        } else {
          let NameParts = this.GetTwoPartedName(
            this.FacultyForm.get("Studentfullname").value
          );
          this.FacultyForm.controls["Studentfirstname"].setValue(
            NameParts.FirstName
          );
          this.FacultyForm.controls["Studentlastname"].setValue(
            NameParts.LastName
          );
        }
        this.FacultyForm.controls["Type"].setValue("student");
      } else if (this.IsFaculty) {
        this.FacultyForm.controls["Type"].setValue("faculty");
        if (!IsValidType(this.FacultyForm.get("FirstName").value)) {
          ErrorFields.push("FirstName");
        }

        if (!IsValidType(this.FacultyForm.get("LastName").value)) {
          ErrorFields.push("LastName");
        }

        if (!IsValidType(this.FacultyForm.get("MobileNumber").value)) {
          ErrorFields.push("MobileNumber");
        }
      } else if (this.IsStaff) {
        this.FacultyForm.controls["Type"].setValue("staff");
        if (!IsValidType(this.FacultyForm.get("FirstName").value)) {
          ErrorFields.push("FirstName");
        }

        if (!IsValidType(this.FacultyForm.get("LastName").value)) {
          ErrorFields.push("LastName");
        }

        if (!IsValidType(this.FacultyForm.get("MobileNumber").value)) {
          ErrorFields.push("MobileNumber");
        }
      }

      if (ErrorFields.length > 0) {
        ErrorFields.forEach((val, index) => {
          $("#" + val).addClass("error-field");
        });
      } else {
        let formData = new FormData();
        formData.append("image", this.FacultyImageType);
        let FacultyObject = this.FacultyForm.value;
        formData.append(
          "quickRegistrationObject",
          JSON.stringify(FacultyObject)
        );

        this.http.upload("Registration/QuickRegistration", formData).then(
          (response) => {
            if (
              this.commonService.IsValidResponse(response) &&
              response.ResponseBody === "Registration done successfully"
            ) {
              this.commonService.ShowToast("Registration done successfully.");
              this.InitPage();
              let Data = response.content.data;
              if (Data != null && Data != "") {
                this.commonService.ShowToast("Data retrieve successfully.");
              } else {
              }
            } else {
              this.commonService.ShowToast("Unable to save data.");
            }
          },
          (error) => {
            this.commonService.ShowToast(
              "Server error. Please contact to admin."
            );
          }
        );
      }
    } catch (ex) {
      console.log("Got error");
    }
  }
}
