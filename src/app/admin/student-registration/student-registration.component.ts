import { iNavigation } from "src/providers/iNavigation";
import { FormControl } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { DefaultUserImage, ZerothIndex,   Zip,
  Doc,
  Pdf,
  Txt,
  FlatFile,
  Excel } from "src/providers/constants";
import * as $ from "jquery";
import {
  IsValidType,
  CommonService,
  IsValidBoolean,
} from "src/providers/common-service/common.service";
import { AjaxService } from "src/providers/ajax.service";
import { ClassDetail } from "src/app/app.component";
import { ApplicationStorage } from "src/providers/ApplicationStorage";
import { Files } from "../faculty-registration/faculty-registration.component";

@Component({
  selector: "app-student-registration",
  templateUrl: "./student-registration.component.html",
  styleUrls: ["./student-registration.component.scss"],
})
export class StudentRegistrationComponent implements OnInit, OnDestroy {
  newparent: boolean = true;
  existparent: boolean = true;
  ParentList: Array<ParentDetail> = [];
  Occupation: Array<any> = [];
  Qualification: Array<any> = [];
  languages: Array<string> = [];
  SectionDetail: Array<any> = [];
  IsExistingParent: boolean = false;
  IsUpdating: boolean = true;
  IsReady: boolean = false;
  DocFiles: Array<any> = [];
  ProfileImageName: string = "profile";
  StudentData: StudentModal;
  StudentForm: FormGroup;
  StudentImage: any;
  StudentImageType: any;
  ClassDetail: Array<ClassDetail>;
  Classes: Array<string>;
  Sections: Array<ClassDetail>;
  ImagePath: string = "";
  DocumentImages: Array<any> = [];
  viewUrl: string = "";
  isEnlarge: boolean = false;
  States: Array<any> = [];
  isCityDataEmpty: boolean = true;
  cities: Array<any> = [];
  MaxDate: any = {year: (new Date).getFullYear(), month: (new Date).getMonth() + 1, day: (new Date).getDate()};
  MinDate: any = {year: (new Date).getFullYear() - 20, month: 1, day: 1};

  DocumentImageObjects: Array<any> = [];

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private http: AjaxService,
    private storage: ApplicationStorage,
    private nav: iNavigation
    //config: NgbDatepickerConfig
  ) {
    this.ImagePath = `${this.http.GetImageBasePath()}`;
    this.ClassDetail = this.storage.GetClassDetail();
    this.StudentImage = DefaultUserImage;
    // config.minDate = {year:currentDate.getFullYear(), month:currentDate.getMonth()+1, day: currentDate.getDate()};
    // config.maxDate = {year: 2099, month: 12, day: 31};
  }

  SelectedDate(e: any){
    let TotalYears = (new Date().getFullYear()) - e.year;
    this.StudentForm.controls["Age"].setValue(TotalYears);
  }

  ngOnInit() {
    this.States = this.commonService.GetStates();
    let Data = this.nav.getValue();
    let EditData = JSON.parse(Data);
    if (IsValidType(EditData) && IsValidType(EditData["studentUid"])) {
      this.http
        .get(`Registration/GetStudentByUid?Uid=${EditData.studentUid}`)
        .then((result) => {
          if (IsValidType(result.ResponseBody)) {
            let Tables = JSON.parse(result.ResponseBody);
            let ResponseStudentData = Tables['Table'];
            if (IsValidType(ResponseStudentData)) {
              this.BindData(ResponseStudentData[ZerothIndex]);
            } else {
              this.commonService.ShowToast(
                "Invalid response. Please contact to admin."
              );
            }

            if (IsValidType(Tables["Table1"])) {
              this.BuildImagesArray(Tables["Table1"]);
            }
          } else {
            this.commonService.ShowToast(
              "Invalid response. Please contact to admin."
            );
          }
        })
        .catch((err) => {
          this.commonService.ShowToast(
            "Server error. Please contact to admin."
          );
        });
    } else {
      this.InitStudentForm();
    }
  }

  BindCities(e: any) {
    this.cities = this.commonService.GetCities(e.target.value);
    if(IsValidType(this.cities))
      this.isCityDataEmpty = false;
  }

  BuildImagesArray(DocImages: any) {
    if (IsValidType(DocImages)) {
      this.DocFiles = DocImages;
      let ProfileImageDetail = DocImages.filter(
        (x) => x.FileName.indexOf(this.ProfileImageName) !== -1
      );
      if (ProfileImageDetail.length) {
        ProfileImageDetail = ProfileImageDetail[ZerothIndex];
        this.StudentImage = `${this.http.GetImageBasePath()}${
          ProfileImageDetail.FilePath
        }/${ProfileImageDetail.FileName}.${ProfileImageDetail.FileExtension}`;
      }
      let DocumentDetail = DocImages.filter(
        (x) => x.FileName.indexOf(this.ProfileImageName) === -1
      );
      if (DocumentDetail.length > 0) {
        let index = 0;
        let ActualPath = "";
        let LocalFilePath = "";
        while (index < DocumentDetail.length) {
          LocalFilePath = this.commonService.OtherFilePath(
            DocumentDetail[index].FileExtension
          );

          if (LocalFilePath === null || LocalFilePath === "") {
            LocalFilePath = `${this.http.GetImageBasePath()}${
              DocumentDetail[index].FilePath
            }/${DocumentDetail[index].FileName}.${DocumentDetail[index].FileExtension}`;
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

  GetDocumentFile(fileInput: any) {
    this.DocumentImages = [];
    this.DocumentImages = [];
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
        this.DocumentImages.push(file);
        let mimeType = file.type;
        if (mimeType.match(/image\/*/) == null) {
          extension = file.name.slice(file.name.lastIndexOf(".") + 1);
          if (extension === "pdf") OtherFilePath = Pdf;
          else if (extension === "doc" || extension === "docx") OtherFilePath = Doc;
          else if (extension === "txt") OtherFilePath = Txt;
          else if (extension === "zip") OtherFilePath = Zip;
          else if (extension === "ppt" || extension === "pptx") OtherFilePath = Doc;
          else if (extension === "xlsx" || extension === "xls") OtherFilePath = Doc;
          else OtherFilePath = FlatFile;

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

  ngOnDestroy() {
    $("#studentRegistration").find("input, textarea, select").off("focus");
    console.log("[StudentRegistrationComponent]: dynamic event removed.");
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    $("#studentRegistration")
      .find("input, textarea, select")
      .on("focus", () => {
        $(event.currentTarget).removeClass("error-field");
      });
  }

  BindData(ResponseStudentData: StudentModal) {
    this.Classes = this.storage.GetClasses();
    this.StudentImage = `${this.ImagePath}${ResponseStudentData.FilePath}/${ResponseStudentData.ImageUrl}`;
    this.StudentForm = this.fb.group({
      studentUid: new FormControl(ResponseStudentData.StudentUid),
      schooltenentId: new FormControl(),
      ParentDetailId: new FormControl(ResponseStudentData.ParentDetailId),
      FirstName: new FormControl(ResponseStudentData.FirstName),
      LastName: new FormControl(ResponseStudentData.LastName),
      ImageUrl: new FormControl(this.StudentImage),
      Dob: new FormControl(
        ResponseStudentData.Dob === null
          ? ""
          : new Date(ResponseStudentData.Dob)
      ),
      Age: new FormControl(ResponseStudentData.Age),
      Sex: new FormControl(ResponseStudentData.Sex),
      LastSchoolAddress: new FormControl(ResponseStudentData.LastSchoolAddress),
      LastSchoolName: new FormControl(ResponseStudentData.LastSchoolName),
      LastSchoolMedium: new FormControl(ResponseStudentData.LastSchoolMedium),
      CurrentSchoolMedium: new FormControl(
        ResponseStudentData.CurrentSchoolMedium
      ),
      Rollno: new FormControl(ResponseStudentData.Rollno),
      Mobilenumber: new FormControl(ResponseStudentData.Mobilenumber),
      AlternetNumber: new FormControl(ResponseStudentData.AlternetNumber),
      EmailId: new FormControl(ResponseStudentData.EmailId),
      RegistrationNo: new FormControl(ResponseStudentData.RegistrationNo),
      AdmissionDatetime: new FormControl(ResponseStudentData.AdmissionDatetime),
      FeeCode: new FormControl(ResponseStudentData.FeeCode),
      MotherTongue: new FormControl(ResponseStudentData.MotherTongue),
      Religion: new FormControl(ResponseStudentData.Religion),
      Catagory: new FormControl(ResponseStudentData.Catagory),
      CatagoryDocPath: new FormControl(ResponseStudentData.CatagoryDocPath),
      SiblingRegistrationNo: new FormControl(
        ResponseStudentData.SiblingRegistrationNo
      ),
      LastClass: new FormControl(ResponseStudentData.LastClass),
      Motherfullname: new FormControl(
        ResponseStudentData.MotherFirstName +
          " " +
          ResponseStudentData.MotherLastName
      ),
      Fatherfullname: new FormControl(
        ResponseStudentData.FatherFirstName +
          " " +
          ResponseStudentData.FatherLastName
      ),
      FatherFirstName: new FormControl(ResponseStudentData.FatherFirstName),
      FatherLastName: new FormControl(ResponseStudentData.FatherLastName),
      MotherFirstName: new FormControl(ResponseStudentData.MotherFirstName),
      MotherLastName: new FormControl(ResponseStudentData.MotherLastName),
      LocalGuardianFullName: new FormControl(
        ResponseStudentData.LocalGuardianFullName
      ),
      FatherMobileno: new FormControl(ResponseStudentData.FatherMobileno),
      Mothermobileno: new FormControl(ResponseStudentData.Mothermobileno),
      LocalGuardianMobileno: new FormControl(
        ResponseStudentData.LocalGuardianMobileno
      ),
      FullAddress: new FormControl(ResponseStudentData.FullAddress),
      City: new FormControl(ResponseStudentData.City),
      Pincode: new FormControl(ResponseStudentData.Pincode),
      State: new FormControl(ResponseStudentData.State),
      Fatheremailid: new FormControl(ResponseStudentData.Fatheremailid),
      Motheremailid: new FormControl(ResponseStudentData.Motheremailid),
      LocalGuardianemailid: new FormControl(
        ResponseStudentData.LocalGuardianemailid
      ),
      Fatheroccupation: new FormControl(ResponseStudentData.Fatheroccupation),
      Motheroccupation: new FormControl(ResponseStudentData.Motheroccupation),
      Fatherqualification: new FormControl(
        ResponseStudentData.Fatherqualification
      ),
      Motherqualification: new FormControl(
        ResponseStudentData.Motherqualification
      ),
      Class: new FormControl(ResponseStudentData.Class),
      Section: new FormControl(ResponseStudentData.Section),
      ExistingNumber: new FormControl(ResponseStudentData.ExistingNumber),
      CreatedBy: new FormControl(ResponseStudentData.CreatedBy),
      ParentRecordExist: new FormControl(
        IsValidBoolean(ResponseStudentData.ParentRecordExist)
      ),
      ClassDetailUid: new FormControl(ResponseStudentData.ClassDetailId),
      MobileNumbers: new FormControl(ResponseStudentData.MobileNumbers),
      EmailIds: new FormControl(ResponseStudentData.EmailIds),
      IsQuickRegistration: new FormControl(
        IsValidBoolean(ResponseStudentData.IsQuickRegistration)
      ),
      ProfileImageName: new FormControl(ResponseStudentData.ProfileImageName),
      FileUid: new FormControl(ResponseStudentData.FileUid),
      FilePath: new FormControl(ResponseStudentData.FilePath),
      FileName: new FormControl(ResponseStudentData.FileName),
      FileExtension: new FormControl(ResponseStudentData.FileExtension),
    });
    this.BindSections(ResponseStudentData.Class);
    this.IsReady = true;
    this.ScrollTop();
  }

  ScrollTop() {
    this.commonService.Scrollto($("body"));
  }

  InitStudentForm() {
    this.Classes = this.storage.GetClasses();
    this.StudentForm = this.fb.group({
      StudentUid: new FormControl(""),
      SchooltenentId: new FormControl(""),
      ParentDetailId: new FormControl(""),
      FirstName: new FormControl(""),
      LastName: new FormControl(""),
      ImageUrl: new FormControl(""),
      Dob: new FormControl(""),
      Age: new FormControl(0),
      Sex: new FormControl(""),
      LastSchoolAddress: new FormControl(""),
      LastSchoolName: new FormControl(""),
      LastSchoolMedium: new FormControl(""),
      CurrentSchoolMedium: new FormControl(""),
      Rollno: new FormControl(0),
      Mobilenumber: new FormControl(""),
      AlternetNumber: new FormControl(""),
      EmailId: new FormControl(""),
      RegistrationNo: new FormControl(""),
      AdmissionDatetime: new FormControl(""),
      FeeCode: new FormControl(0),
      MotherTongue: new FormControl(""),
      Religion: new FormControl(""),
      Catagory: new FormControl(""),
      CatagoryDocPath: new FormControl(""),
      SiblingRegistrationNo: new FormControl(""),
      LastClass: new FormControl(""),
      Motherfullname: new FormControl(""),
      Fatherfullname: new FormControl(""),
      FatherFirstName: new FormControl(""),
      FatherLastName: new FormControl(""),
      MotherFirstName: new FormControl(""),
      MotherLastName: new FormControl(""),
      LocalGuardianFullName: new FormControl(""),
      FatherMobileno: new FormControl(""),
      Mothermobileno: new FormControl(""),
      LocalGuardianMobileno: new FormControl(""),
      FullAddress: new FormControl(""),
      City: new FormControl(""),
      Pincode: new FormControl(""),
      State: new FormControl(""),
      Fatheremailid: new FormControl(""),
      Motheremailid: new FormControl(""),
      LocalGuardianemailid: new FormControl(""),
      Fatheroccupation: new FormControl(""),
      Motheroccupation: new FormControl(""),
      Fatherqualification: new FormControl(""),
      Motherqualification: new FormControl(""),
      Class: new FormControl(""),
      Section: new FormControl(""),
      ExistingNumber: new FormControl(""),
      CreatedBy: new FormControl(""),
      ParentRecordExist: new FormControl(false),
      ClassDetailUid: new FormControl(""),
      MobileNumbers: new FormControl(""),
      EmailIds: new FormControl(""),
      IsQuickRegistration: new FormControl(false),
      ProfileImageName: new FormControl(""),
      FileUid: new FormControl(""),
      FilePath: new FormControl(""),
      FileName: new FormControl(""),
      FileExtension: new FormControl(""),
    });
    this.IsReady = true;
    this.ScrollTop();
  }

  Addsibling() {}

  Resetall() {}

  RegisterNow() {
    let ErrorFields = [];
    try {
      if (IsValidType(this.StudentForm.get("Fatherfullname").value)) {
        let FullName = this.StudentForm.get("Fatherfullname").value;
        if (IsValidType(FullName)) {
          let PartedName = this.GetTwoPartedName(FullName);
          this.StudentForm.controls["FatherFirstName"].setValue(
            PartedName.FirstName
          );
          this.StudentForm.controls["FatherLastName"].setValue(
            PartedName.LastName
          );
        } else {
          ErrorFields.push("Fatherfullname");
        }
      } else {
        ErrorFields.push("Fatherfullname");
      }

      if (!IsValidType(this.StudentForm.get("FatherMobileno").value)) {
        ErrorFields.push("FatherMobileno");
      }

      /*-------------------------- Mother detail -------------------------------*/

      if (IsValidType(this.StudentForm.get("Motherfullname").value)) {
        let FullName = this.StudentForm.get("Motherfullname").value;
        if (IsValidType(FullName)) {
          let PartedName = this.GetTwoPartedName(FullName);
          this.StudentForm.controls["MotherFirstName"].setValue(
            PartedName.FirstName
          );
          this.StudentForm.controls["MotherLastName"].setValue(
            PartedName.LastName
          );
        } else {
          ErrorFields.push("Motherfullname");
        }
      } else {
        ErrorFields.push("Motherfullname");
      }

      if (!IsValidType(this.StudentForm.get("MotherTongue").value)) {
        ErrorFields.push("MotherTongue");
      }

      if (!IsValidType(this.StudentForm.get("FirstName").value)) {
        ErrorFields.push("FirstName");
      }

      if (!IsValidType(this.StudentForm.get("FullAddress").value)) {
        ErrorFields.push("FullAddress");
      }

      if (!IsValidType(this.StudentForm.get("City").value)) {
        ErrorFields.push("City");
      }

      if (!IsValidType(this.StudentForm.get("State").value)) {
        ErrorFields.push("State");
      }

      if (!IsValidType(this.StudentForm.get("Class").value)) {
        ErrorFields.push("Class");
      }

      if (IsValidType(this.StudentForm.get("ClassDetailUid").value)) {
        let Uid = this.StudentForm.get("ClassDetailUid").value;
        let SelectedSection = this.ClassDetail.filter(
          (x) => x.ClassDetailUid === Uid
        );
        if (SelectedSection.length > 0) {
          this.StudentForm.controls["ClassDetailUid"].setValue(Uid);
          this.StudentForm.controls["Section"].setValue(
            SelectedSection[0].Section
          );
          this.StudentForm.controls["FeeCode"].setValue("0");
        } else {
          ErrorFields.push("Section");
        }
      } else {
        ErrorFields.push("Section");
      }

      if (IsValidType(this.StudentForm.get("Dob").value)) {
        let Year = this.StudentForm.value.Dob.year;
        let Month = this.StudentForm.value.Dob.month - 1;
        let Day = this.StudentForm.value.Dob.day;
        if (IsValidType(Year)) {
        }
        try {
          let UserDob: any = new Date(Year, Month, Day);
          if (!isNaN(UserDob.getTime())) {
            this.StudentForm.controls["Dob"].setValue(UserDob);
            this.StudentForm.controls["Age"].setValue(10);
          }
        } catch (e) {
          this.commonService.ShowToast("Invalid date selected.");
          return;
        }
      } else {
        this.StudentForm.controls["Dob"].setValue(new Date());
      }

      if (!IsValidType(this.StudentForm.get("Sex").value)) {
        this.StudentForm.controls["Sex"].setValue(true);
      }

      if (!IsValidType(this.StudentForm.get("Catagory").value)) {
        ErrorFields.push("Catagory");
      }

      if (!IsValidType(this.StudentForm.get("Pincode").value)) {
        ErrorFields.push("Pincode");
      }

      let files = Array<Files>();
      this.StudentForm.controls["AdmissionDatetime"].setValue(new Date());
      if (ErrorFields.length > 0) {
        this.ScrollTop();
        let Form = $("#studentRegistration");
        ErrorFields.forEach((item, index) => {
          if ($(Form).find('input[name="' + item + '"]').length > 0) {
            $(Form)
              .find('input[name="' + item + '"]')
              .addClass("error-field");
          } else {
            $(Form)
              .find('select[name="' + item + '"]')
              .addClass("error-field");

            $(Form)
              .find('textarea[name="' + item + '"]')
              .addClass("error-field");
          }
        });
        this.commonService.ShowToast("Please fill all red marked fields.");
      } else {
        let formData = new FormData();
        if (
          typeof this.StudentImageType !== 'undefined' &&
          this.StudentImageType !== null
        ){
          formData.append("profile", this.StudentImageType);
          this.BuildFilesModel(files, "profile", this.StudentImageType);
        }
        
        if (this.DocumentImages.length > 0) {
          let index = 0;
          while (index < this.DocumentImages.length) {
            formData.append("file_" + index, this.DocumentImages[index]);
            this.BuildFilesModel(files, "file_" + index, this.DocumentImages[index]);
            index++;
          }
        }
        let StudentObject = this.StudentForm.value;
        formData.append("studentObject", JSON.stringify(StudentObject));
        formData.append("fileDetail", JSON.stringify(files));

        this.http.upload("Registration/StudentRegistration", formData).then(
          (response) => {
            if (
              this.commonService.IsValidResponse(response) &&
              (response.ResponseBody === "Registration done successfully" ||
                response.ResponseBody === "Record done successfully")
            ) {
              this.commonService.ShowToast(response.ResponseBody);
              this.InitStudentForm();
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
    } catch (e) {
      this.commonService.ShowToast(
        "Getting some error. Please re-verify form again."
      );
    }
  }

  BuildFilesModel(filesModel: Array<Files>, uniqueKey: string, data: File) {
    let file = new Files();
    file.FileExtension = data.type;
    file.FileName = uniqueKey;
    file.FileUid = uniqueKey;
    filesModel.push(file);
  }

  GetFile(fileInput: any) {
    let Files = fileInput.target.files;
    if (Files.length > 0) {
      this.StudentImageType = <File>Files[0];
      let extension = this.StudentImageType.name.substr(
        this.StudentImageType.name.lastIndexOf(".") + 1
      );
      this.StudentForm.controls["ImageUrl"].setValue("profile." + extension);
      let mimeType = this.StudentImageType.type;
      if (mimeType.match(/image\/*/) == null) {
        console.log("Only images are supported.");
        return;
      }

      let reader = new FileReader();
      reader.readAsDataURL(this.StudentImageType);
      reader.onload = (fileEvent) => {
        this.StudentImage = reader.result;
      };
    } else {
      this.StudentImage.ShowToast("No file selected");
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
    let PartedName = FullName.trim().split(" ");
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

  ManageSection() {}

  EnlargeItem(Url: string) {
    if(Url !== null && Url !== "") {
      this.viewUrl = Url;
      this.isEnlarge = true;
    }
  }

  OpenBrowseOptions() {
    event.preventDefault();
    $("#document-btn").click();
  }
}

interface ParentDetail {
  MobileNo: string;
  ParentId: string;
  FullName: string;
}

class StudentModal {
  StudentUid: string = "";
  SchooltenentId: string = "";
  ParentDetailId: string = "";
  FirstName: string = "";
  LastName: string = "";
  ImageUrl: string = "";
  Dob: Date = new Date();
  Age: number = 0;
  Sex: boolean = true;
  LastSchoolAddress: string = "";
  LastSchoolName: string = "";
  LastSchoolMedium: string = "";
  CurrentSchoolMedium: string = "";
  Rollno: number = 0;
  Mobilenumber: string = "";
  AlternetNumber: string = "";
  EmailId: string = "";
  RegistrationNo: string = "";
  AdmissionDatetime: Date = new Date();
  FeeCode: number = 0;
  MotherTongue: string = "";
  Religion: string = "";
  Catagory: string = "";
  CatagoryDocPath: string = "";
  SiblingRegistrationNo: string = "";
  LastClass: string = "";
  FatherFirstName: string = "";
  FatherLastName: string = "";
  MotherFirstName: string = "";
  MotherLastName: string = "";
  LocalGuardianFullName: string = "";
  FatherMobileno: string = "";
  Mothermobileno: string = "";
  LocalGuardianMobileno: string = "";
  FullAddress: string = "";
  City: string = "";
  Pincode: string = "";
  State: string = "";
  Fatheremailid: string = "";
  Motheremailid: string = "";
  LocalGuardianemailid: string = "";
  Fatheroccupation: string = "";
  Motheroccupation: string = "";
  Fatherqualification: string = "";
  Motherqualification: string = "";
  Class: string = "";
  Section: string = "";
  ExistingNumber: string = "";
  CreatedBy: string = "";
  ParentRecordExist: boolean = false;
  ClassDetailId: string = "";
  MobileNumbers: string = "";
  EmailIds: string = "";
  IsQuickRegistration: boolean = false;
  ProfileImageName: string = "";
  FileUid: string = "";
  FilePath: string = "";
  FileName: string = "";
  FileExtension: string = "";
}
