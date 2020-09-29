import { Component, OnInit } from "@angular/core";
import { FormControl, FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-staff-registration",
  templateUrl: "./staff-registration.component.html",
  styleUrls: ["./staff-registration.component.scss"]
})
export class StaffRegistrationComponent implements OnInit {
  UserData: any = {};
  StaffReg: StaffRegModal;
  StaffRegForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.InitForm();
  }

  ngOnInit() {}

  RegisterNow() {}

  InitForm() {
    this.StaffRegForm = this.fb.group({
      FirstName: new FormControl(),
      LastName: new FormControl(),
      Gender: new FormControl(),
      Dob: new FormControl(),
      MobileNumber: new FormControl(),
      StaffMemberUid: new FormControl(),
      AlternetNumber: new FormControl(),
      Email: new FormControl(),
      Address: new FormControl(),
      State: new FormControl(),
      City: new FormControl(),
      Pincode: new FormControl(),
      University: new FormControl(),
      DegreeName: new FormControl(),
      Grade: new FormControl(),
      Marks: new FormControl(),
      ExprienceInYear: new FormControl(),
      ExperienceInMonth: new FormControl(),
      AdminId: new FormControl(),
      SchoolTenentId: new FormControl(),
      IsAdmin: new FormControl(),
      ClassDetailUid: new FormControl(),
      ImageUrl: new FormControl(),
      DesignationId: new FormControl(),
      Subjects: new FormControl(),
      Type: new FormControl(),
      ProfileImageName: new FormControl(),
      ProofOfDocumentationPath: new FormControl(),
      NumberOfDocuments: new FormControl(),
      ExistingDocumentFileName: new FormControl(),
      IsQuickRegistration: new FormControl()
    });
  }
}

export interface StaffRegModal {
  FirstName: string;
  LastName: string;
  Gender: boolean;
  Dob: Date;
  MobileNumber: string;
  StaffMemberUid: string;
  AlternetNumber: string;
  Email: string;
  Address: string;
  State: string;
  City: string;
  Pincode: number;
  University: string;
  DegreeName: string;
  Grade: string;
  Marks: number;
  ExprienceInYear: number;
  ExperienceInMonth: number;
  AdminId: string;
  SchoolTenentId: string;
  IsAdmin: boolean;
  ClassDetailUid: string;
  ImageUrl: string;
  DesignationId: number;
  Subjects: string;
  Type: string;
  ProfileImageName: string;
  ProofOfDocumentationPath: string;
  NumberOfDocuments: number;
  ExistingDocumentFileName: string;
  IsQuickRegistration: boolean;
}
