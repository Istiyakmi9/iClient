import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FormControl } from "@angular/forms";
import {
  DefaultUserImage,
  FacultyRegistration,
  StaffMemberRegistration,
  ZerothIndex,
  Zip,
  Doc,
  Pdf,
  Txt,
  File,
  Excel,
} from "src/providers/constants";
import * as $ from "jquery";
import {
  CommonService,
  IsValidType,
  ActualOrDefault,
} from "src/providers/common-service/common.service";
import { AjaxService } from "src/providers/ajax.service";
import { NgbDateStruct, NgbCalendar } from "@ng-bootstrap/ng-bootstrap";
import { iNavigation } from "src/providers/iNavigation";
import { ClassDetail } from "src/app/app.component";
import { ApplicationStorage } from "src/providers/ApplicationStorage";

@Component({
  selector: "app-faculty-registration",
  templateUrl: "./faculty-registration.component.html",
  styleUrls: ["./faculty-registration.component.scss"],
})
export class FacultyRegistrationComponent implements OnInit {
  UserData: any = {};
  steps: any = {};
  FacultyDocumentImages: Array<any> = [];
  DocumentImages: Array<any> = [];
  DocumentImageObjects: Array<any> = [];
  FacultyImageType: any;
  FacultyForm: FormGroup;
  DefaultSubject: string;
  FacultyImage: any;
  ClassDetail: Array<ClassDetail>;
  Classes: Array<string>;
  Sections: Array<ClassDetail>;
  TitleDetail: string;
  Title: string;
  IsFaculty: boolean = false;
  FacultyRoles: Array<any> = [];
  dateModel: NgbDateStruct;
  date: { year: number; month: number };
  ExprienceInYear: Array<any> = [];
  DocFiles: Array<any> = [];
  SubjectDetail: any;
  IsReady: boolean = false;
  IsEnableSection: boolean = true;
  ProfileImageName: string = "profile.";
  ImagePath: string = "";
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private storage: ApplicationStorage,
    private http: AjaxService,
    private calendar: NgbCalendar,
    private nav: iNavigation
  ) {
    this.ImagePath = `${this.http.GetImageBasePath()}Faculties`;
    this.MangePageInformation();
    this.ClassDetail = this.storage.GetClassDetail();
    this.InitPage();
    this.FacultyImage = DefaultUserImage;
  }

  ngOnInit() {
    this.DefaultSubject = "";
    let Data = this.nav.getValue();
    let EditData = JSON.parse(Data);
    this.LoadInitData(EditData);
  }

  GetOtherFilePath(FileExtension: string) {
    let OtherFilePath = "";
    if (FileExtension === "pdf") OtherFilePath = Pdf;
    else if (FileExtension === "doc") OtherFilePath = Doc;
    else if (FileExtension === "txt") OtherFilePath = Txt;
    else if (FileExtension === "zip") OtherFilePath = Zip;
    else if (FileExtension === "xls") OtherFilePath = Excel;
    else if (FileExtension == "") OtherFilePath = File;
    return OtherFilePath;
  }

  RemoveItem(FileUid: string) {
    if (FileUid !== null && FileUid !== "") {
      this.http.delete("Registration/DeleteImage", FileUid).then((response) => {
        if (this.commonService.IsValidResponse(response)) {
          alert(response);
          this.commonService.ShowToast("Deleted successfully.");
        } else {
          this.commonService.ShowToast("Fail to delete.");
        }
      });
    }
  }

  EnlargeItem(Url: string) {
    alert(Url);
  }

  BuildImagesArray(DocImages: any) {
    if (IsValidType(DocImages)) {
      this.DocFiles = DocImages;
      let ProfileImageDetail = DocImages.filter(
        (x) => x.FileName.indexOf(this.ProfileImageName) !== -1
      );
      if (ProfileImageDetail.length) {
        ProfileImageDetail = ProfileImageDetail[ZerothIndex];
        this.FacultyImage = `${this.http.GetImageBasePath()}${
          ProfileImageDetail.FilePath
        }/${ProfileImageDetail.FileName}`;
      }
      let DocumentDetail = DocImages.filter(
        (x) => x.FileName.indexOf(this.ProfileImageName) === -1
      );
      if (DocumentDetail.length > 0) {
        let index = 0;
        let ActualPath = "";
        let LocalFilePath = "";
        while (index < DocumentDetail.length) {
          LocalFilePath = this.GetOtherFilePath(
            DocumentDetail[index].FileExtension
          );
          if (LocalFilePath === "") {
            LocalFilePath = `${this.http.GetImageBasePath()}${
              DocumentDetail[index].FilePath
            }/${DocumentDetail[index].FileName}`;
          }

          ActualPath = `${this.http.GetImageBasePath()}${
            DocumentDetail[index].FilePath
          }/${DocumentDetail[index].FileName}`;

          this.DocumentImageObjects.push({
            FileUid: DocumentDetail[index].FileUid,
            FileOn: "local",
            FilePath: LocalFilePath,
            ActualPath: ActualPath,
          });
          index++;
        }
      }
    }
  }

  LoadInitData(EditData: any) {
    if (IsValidType(EditData) && IsValidType(EditData["StaffMemberUid"])) {
      this.http
        .get(`Registration/GetStaffMemberByUid?Uid=${EditData.StaffMemberUid}`)
        .then((result) => {
          if (IsValidType(result.ResponseBody)) {
            let Tables = JSON.parse(result.ResponseBody);
            if (IsValidType(Tables["Table"])) {
              let ResponseStudentData = Tables["Table"];
              if (IsValidType(ResponseStudentData)) {
                this.BindData(ResponseStudentData[ZerothIndex]);
              } else {
                this.commonService.ShowToast(
                  "Invalid response. Please contact to admin."
                );
              }
            }

            if (IsValidType(Tables["Table1"])) {
              this.BuildImagesArray(Tables["Table1"]);
            }
          } else {
            this.commonService.ShowToast(
              "Invalid response. Please contact to admin."
            );
          }
          this.IsReady = true;
        })
        .catch((err) => {
          this.commonService.ShowToast(
            "Server error. Please contact to admin."
          );
          this.IsReady = true;
        });
    } else {
      this.InitPage();
      this.IsReady = true;
    }
  }

  BindData(FacultyData: any) {
    let facultyModal = new FacultyModal();
    FacultyData = ActualOrDefault(FacultyData, facultyModal);
    this.FacultyImage =
      this.ImagePath +
      "/" +
      FacultyData.MobileNumber +
      "/" +
      FacultyData.ImageUrl;
    if (IsValidType(FacultyData)) {
      this.selectDate(FacultyData.Dob);
      this.FacultyForm = this.fb.group({
        StaffMemberUid: new FormControl(FacultyData.StaffMemberUid),
        SchooltenentId: new FormControl(FacultyData.StaffMemberUid),
        ClassTeacherForClass: new FormControl(FacultyData.ClassTeacherForClass),
        FirstName: new FormControl(FacultyData.FirstName),
        LastName: new FormControl(FacultyData.LastName),
        Gender: new FormControl(FacultyData.Gender),
        Dob: new FormControl(FacultyData.Dob),
        Doj: new FormControl(FacultyData.Doj),
        MobileNumber: new FormControl(FacultyData.MobileNumber),
        AlternetNumber: new FormControl(FacultyData.AlternetNumber),
        Designation: new FormControl("Faculty"),
        ImageUrl: new FormControl(FacultyData.ImageUrl),
        Email: new FormControl(FacultyData.Email),
        Address: new FormControl(FacultyData.Address),
        City: new FormControl(FacultyData.City),
        State: new FormControl(FacultyData.State),
        Pincode: new FormControl(FacultyData.Pincode),
        Subjects: new FormControl(FacultyData.Subjects),
        Type: new FormControl(FacultyData.Type),
        QualificationId: new FormControl(FacultyData.QualificationId),
        DesignationId: new FormControl(FacultyData.DesignationId),
        Class: new FormControl(FacultyData.Class),
        Section: new FormControl(FacultyData.Section),
        ClassDetailUid: new FormControl(FacultyData.ClassDetailUid),
        DegreeName: new FormControl(FacultyData.DegreeName),
        Grade: new FormControl(FacultyData.Grade),
        Position: new FormControl(FacultyData.Position),
        MarksObtain: new FormControl(FacultyData.MarksObtain),
        SchoolUniversityName: new FormControl(FacultyData.SchoolUniversityName),
        ProofOfDocumentationPath: new FormControl(
          FacultyData.ProofOfDocumentationPath
        ),
        ExprienceInYear: new FormControl(FacultyData.ExprienceInYear),
        ExperienceInMonth: new FormControl(FacultyData.ExperienceInMonth),
        Title: new FormControl(FacultyData.Title),
      });
      this.DefaultSubject = FacultyData.Subjects;
    }
    this.BindSections(FacultyData.Class);
  }

  selectDate(passedDate: string) {
    if (IsValidType(passedDate)) {
      let date = new Date(passedDate);
      let selectedDate: NgbDateStruct = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      };
      this.dateModel = selectedDate;
    }
  }

  MangePageInformation() {
    if (this.commonService.GetCurrentPageName() === FacultyRegistration) {
      this.TitleDetail = "Faculty or Teaching staff registration page.";
      this.Title = "Faculty Registration";
      this.IsFaculty = true;
    } else if (
      this.commonService.GetCurrentPageName() === StaffMemberRegistration
    ) {
      this.TitleDetail = "Non-Teaching staff registration page.";
      this.Title = "Staff Registration";
      this.IsFaculty = false;
      this.FacultyRoles.push(
        {
          RoleName: "Faculty",
        },
        {
          RoleName: "Driver",
        }
      );
    }
  }

  InitPage() {
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
    this.FacultyForm = this.fb.group({
      FacultyUid: new FormControl("", Validators.required),
      StaffMemberUid: new FormControl("", Validators.required),
      SchooltenentId: new FormControl("", Validators.required),
      ClassDetailUid: new FormControl("", Validators.required),
      Class: new FormControl("", Validators.required),
      Designation: new FormControl("", Validators.required),
      Section: new FormControl("", Validators.required),
      FirstName: new FormControl("", Validators.required),
      LastName: new FormControl("", Validators.required),
      Gender: new FormControl(false, Validators.required),
      Dob: new FormControl(this.dateModel, Validators.required),
      Doj: new FormControl("", Validators.required),
      MobileNumber: new FormControl("", Validators.required),
      AlternetNumber: new FormControl("", Validators.required),
      ImageUrl: new FormControl("", Validators.required),
      Email: new FormControl("", Validators.required),
      Address: new FormControl("", Validators.required),
      City: new FormControl("", Validators.required),
      State: new FormControl("", Validators.required),
      Pincode: new FormControl("", Validators.required),
      Subjects: new FormControl("", Validators.required),
      Type: new FormControl("", Validators.required),
      University: new FormControl("", Validators.required),
      DegreeName: new FormControl("", Validators.required),
      Grade: new FormControl("", Validators.required),
      Marks: new FormControl(0, Validators.required),
      ExprienceInYear: new FormControl("0", Validators.required),
      ExperienceInMonth: new FormControl("0", Validators.required),
      QualificationId: new FormControl("", Validators.required),
      Title: new FormControl(""),
      SchoolUniversityName: new FormControl(""),
    });

    this.ScrollTop();
  }

  OnSubjectSelected(e: any) {
    if (IsValidType(e)) {
      let Data = JSON.parse(e);
      let Subjects = "";
      if (IsValidType(this.FacultyForm.get("Subjects").value)) {
        Subjects = this.FacultyForm.get("Subjects").value;
      }
      Subjects += Data.value;
      this.FacultyForm.controls["Subjects"].setValue(Subjects);
    }
  }

  RegisterFaculty() {
    let ErrorFields = [];
    try {
      if (this.IsFaculty) {
        if (IsValidType(this.FacultyForm.get("ClassDetailUid").value)) {
          let Uid = this.FacultyForm.get("ClassDetailUid").value;
          let CutClassDetail: Array<ClassDetail> = this.ClassDetail.filter(
            (x) => x.ClassDetailUid === Uid
          );
          if (CutClassDetail.length > 0) {
            this.FacultyForm.controls["Section"].setValue(
              CutClassDetail[0].Section
            );
            this.FacultyForm.controls["ClassDetailUid"].setValue(Uid);
          }
        }

        if (!IsValidType(this.FacultyForm.get("ExprienceInYear").value)) {
          ErrorFields.push("ExprienceInYear");
        }

        if (!IsValidType(this.FacultyForm.get("ExperienceInMonth").value)) {
          ErrorFields.push("ExperienceInMonth");
        }
      }

      if (!IsValidType(this.FacultyForm.get("FirstName").value)) {
        ErrorFields.push("FirstName");
      }

      if ($("#male").is(":checked")) {
        this.FacultyForm.controls["Gender"].setValue(true);
      } else {
        this.FacultyForm.controls["Gender"].setValue(false);
      }

      if (IsValidType(this.FacultyForm.get("Dob").value)) {
        let Year = this.FacultyForm.value.Dob.year;
        let Month = this.FacultyForm.value.Dob.month - 1;
        let Day = this.FacultyForm.value.Dob.day;
        try {
          let UserDob: any = new Date(Year, Month, Day);
          if (!isNaN(UserDob.getTime())) {
            this.FacultyForm.controls["Dob"].setValue(UserDob);
          }
        } catch (e) {
          this.commonService.ShowToast("Invalid date selected.");
          return;
        }
      } else {
        this.FacultyForm.controls["Dob"].setValue(new Date());
      }

      if (!IsValidType(this.FacultyForm.get("MobileNumber").value)) {
        ErrorFields.push("MobileNumber");
      }

      if (!IsValidType(this.FacultyForm.get("Address").value)) {
        ErrorFields.push("Address");
      }

      if (!IsValidType(this.FacultyForm.get("Pincode").value)) {
        ErrorFields.push("Pincode");
      }

      if (IsValidType(this.FacultyForm.get("Email").value)) {
        let FacultyEmail = this.FacultyForm.get("Email").value;
        let PartedValue = FacultyEmail.split("@");
        if (PartedValue.length == 2) {
          if (PartedValue[0].length == 0 || PartedValue[1].length == 0) {
            ErrorFields.push("Email");
          }
        } else {
          ErrorFields.push("Email");
        }

        let DotCheck = FacultyEmail.lastIndexOf(".");
        if (DotCheck !== -1) {
          if (DotCheck.length <= DotCheck) {
            ErrorFields.push("Email");
          }
        } else {
          ErrorFields.push("Email");
        }
      }

      if (!this.IsFaculty) {
        if (!IsValidType(this.FacultyForm.get("Designation").value)) {
          ErrorFields.push("Designation");
          this.commonService.ShowToast(
            "Faculty roles is required. Please correct (*) marked fields."
          );
        }
      } else {
        this.FacultyForm.controls["Designation"].setValue("Faculty");
      }

      if (ErrorFields.length > 0) {
        ErrorFields.forEach((val, index) => {
          $("#" + val).addClass("error-field");
        });
      } else {
        let formData = new FormData();
        if (
          this.FacultyImageType !== undefined &&
          this.FacultyImageType !== null
        )
          formData.append("profile", this.FacultyImageType);
        if (this.FacultyDocumentImages.length > 0) {
          let index = 0;
          while (index < this.FacultyDocumentImages.length) {
            formData.append("file_" + index, this.FacultyDocumentImages[index]);
            index++;
          }
        }
        let FacultyObject = this.FacultyForm.value;
        formData.append("facultObject", JSON.stringify(FacultyObject));

        this.http.upload("Registration/Faculty", formData).then(
          (response) => {
            if (this.commonService.IsValidResponse(response)) {
              if (response.ResponseBody === "Record updated successfully") {
                this.commonService.ShowToast("Record updated successfully");
                this.ScrollTop();
              } else if (
                response.ResponseBody === "Registration done successfully"
              ) {
                this.InitPage();
                //let Data = response.content.data;
                this.commonService.ShowToast("Registration done successfully");
              } else {
                this.commonService.ShowToast("Unable to save data.");
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

  ScrollTop() {
    this.commonService.Scrollto($("body"));
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

  GetFile(fileInput: any) {
    let Files = fileInput.target.files;
    if (Files.length > 0) {
      this.FacultyImageType = <File>Files[0];
      let extension = this.FacultyImageType.name.substr(
        this.FacultyImageType.name.lastIndexOf(".") + 1
      );
      this.FacultyForm.controls["ImageUrl"].setValue("profile." + extension);
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

  GetDocumentFile(fileInput: any) {
    this.DocumentImages = [];
    this.FacultyDocumentImages = [];
    let Files = fileInput.target.files;
    if (Files.length > 0) {
      let index = 0;
      let file = null;
      let extension = "";
      let IsImageFile = false;
      let OtherFilePath = "";
      while (index < Files.length) {
        IsImageFile = true;
        OtherFilePath = "";
        file = <File>Files[index];
        this.FacultyDocumentImages.push(file);
        let mimeType = file.type;
        if (mimeType.match(/image\/*/) == null) {
          extension = file.name.slice(file.name.lastIndexOf(".") + 1);
          if (extension === "pdf") OtherFilePath = Pdf;
          else if (extension === "doc") OtherFilePath = Doc;
          else if (extension === "txt") OtherFilePath = Txt;
          else if (extension === "zip") OtherFilePath = Zip;
          else OtherFilePath = File;

          IsImageFile = false;
          this.DocumentImageObjects.push({
            FileUid: index,
            FileOn: "server",
            FilePath: OtherFilePath,
          });
        }

        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (fileEvent) => {
          this.DocumentImages.push(reader.result);
          if (IsImageFile) {
            this.DocumentImageObjects.push({
              FileUid: index,
              FileOn: "server",
              FilePath: reader.result,
            });
          }
        };
        index++;
      }
    } else {
      this.commonService.ShowToast("No file selected");
    }
  }

  // UploadDocuments() {
  //   $("#document-dv").removeClass("d-none");
  // }

  // CloseUploadDoc() {
  //   event.preventDefault();
  //   $("#document-dv").addClass("d-none");
  // }

  OpenBrowseOptions() {
    event.preventDefault();
    $("#document-btn").click();
  }
}

export class FacultyModal {
  StaffMemberUid: string = "";
  SchoolTenentId: string = "";
  ClassTeacherForClass: number = 0;
  FirstName: string = "";
  LastName: string = "";
  Gender: boolean = true;
  Dob: Date = new Date();
  Doj: Date = new Date();
  MobileNumber: string = "";
  AlternetNumber: string = "";
  ImageUrl: string = "";
  Email: string = "";
  Address: string = "";
  City: string = "";
  State: string = "";
  Pincode: number = 0;
  Subjects: string = "";
  Type: string = "";
  QualificationId: string = "";
  DesignationId: string = "";
  Designation: string = "";
  Class: string = "";
  Section: string = "";
  ClassDetailUid: string = "";
  DegreeName: string = "";
  Grade: string = "";
  Position: string = "";
  MarksObtain: number = 0;
  SchoolUniversityName: string = "";
  ProofOfDocumentationPath: string = "";
  ExprienceInYear: number = 0;
  ExperienceInMonth: number = 0;
  Title: string = "";
}
