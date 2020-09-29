import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import {
  CommonService,
  IsValidType,
} from "src/providers/common-service/common.service";
import { AjaxService } from "src/providers/ajax.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import * as $ from "jquery";
import {
  InvalidData,
  SuccessMessage,
  ZerothIndex,
} from "src/providers/constants";
import { ApplicationStorage } from "src/providers/ApplicationStorage";
import { ClassDetail } from "src/app/app.component";

@Component({
  selector: "app-payments",
  templateUrl: "./payments.component.html",
  styleUrls: ["./payments.component.scss"],
})
export class PaymentsComponent implements OnInit {
  attendanceData: FormGroup;
  IsReady: boolean = false;
  ClassDetailUid: string;
  ClassDetail: Array<ClassDetail>;
  Sections: Array<ClassDetail>;
  Classes: Array<string>;
  dateModel: NgbDateStruct;
  SelecteClass: string;
  PaymentDetail: Array<PaymentDetailModal>;
  PagePaymentData: Array<PaymentDetailModal>;
  TodayDayNum: string;
  PaymentYear: number;
  NotFountMessage: string;
  MonthInformation: PaymentMonthlyDetailModal;
  MonthNames: Array<string> = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  constructor(
    private fb: FormBuilder,
    private http: AjaxService,
    private commonService: CommonService,
    private storage: ApplicationStorage
  ) {
    this.TodayDayNum = new Date().getDate().toString();
  }

  ngOnInit() {
    //this.UpdateAttendance();
    this.InitYears();
    this.PaymentYear = new Date().getFullYear();
    this.NotFountMessage = `No Payment detail available for the giver year ${this.PaymentYear}`;
    this.SelecteClass = "";
    this.ClassDetail = this.storage.GetClassDetail();
    this.Classes = this.storage.GetClasses();
    this.ClassDetailUid = "";
    this.selectDate(new Date());
    this.SelectDefault();
  }

  InitYears() {}

  SelectDefault() {
    if (IsValidType(this.ClassDetail)) {
      let FirstItem = this.ClassDetail[ZerothIndex];
      this.BindSections(FirstItem.Class);
      this.SelecteClass = FirstItem.Class;
      this.ClassDetailUid = FirstItem.ClassDetailUid;
      this.LoadData();
    } else {
      this.IsReady = true;
    }
  }

  selectDate(date: Date) {
    if (date !== null) {
      let selectedDate: NgbDateStruct = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      };
      this.dateModel = selectedDate;
    }
  }

  LoadData() {
    let Url = `Accounts/FeesDetail?PayeeUid=&ClassDetailUid=${this.ClassDetailUid}&PaymentYear=${this.PaymentYear}`;
    this.http.get(Url).then((result) => {
      if (IsValidType(result.ResponseBody)) {
        this.PaymentDetail = [];
        this.IsReady = false;
        let Data = JSON.parse(result.ResponseBody);
        if (IsValidType(Data["Table"])) {
          this.PaymentDetail = Data["Table"];
          this.BuildPaymentPageData();
          this.IsReady = true;
        } else {
          this.NotFountMessage = `No Payment detail available for the giver year ${this.PaymentYear}`;
          this.commonService.ShowToast(InvalidData);
        }
        this.commonService.ShowToast(SuccessMessage);
      } else {
        this.NotFountMessage = `No Payment detail available for the giver year ${this.PaymentYear}`;
        this.commonService.ShowToast(InvalidData);
      }
    });
  }

  BuildPaymentPageData() {
    this.PagePaymentData = [];
    let CurrentItem = null;
    let index = 0;
    while (index < this.PaymentDetail.length) {
      CurrentItem = this.PagePaymentData.filter(
        (x) => x.StudentUid === this.PaymentDetail[index].StudentUid
      );
      if (CurrentItem.length > 0) {
        this.UpdatePagePaymentDetail(
          CurrentItem[ZerothIndex].PaymentMonthlyDetail,
          this.PaymentDetail[index]
        );
      } else {
        this.PagePaymentData.push({
          StudentUid: this.PaymentDetail[index].StudentUid,
          PaymentDetailId: this.PaymentDetail[index].PaymentDetailId,
          ParentDetailId: this.PaymentDetail[index].ParentDetailId,
          ClassDetailId: this.PaymentDetail[index].ClassDetailId,
          FirstName: this.PaymentDetail[index].FirstName,
          LastName: this.PaymentDetail[index].LastName,
          ImageUrl: this.PaymentDetail[index].ImageUrl,
          RegistrationNo: this.PaymentDetail[index].RegistrationNo,
          FeeCode: this.PaymentDetail[index].FeeCode,
          PaymentForMonth: this.PaymentDetail[index].PaymentForMonth,
          ForYear: this.PaymentDetail[index].ForYear,
          FineCode: this.PaymentDetail[index].FineCode,
          AmountPaid: this.PaymentDetail[index].AmountPaid,
          AddedOn: this.PaymentDetail[index].AddedOn,
          PaymentMonthlyDetail: this.BindMonths(
            index,
            this.PaymentDetail[index].PaymentForMonth
          ),
        });
      }
      if (index === 0)
        this.SetFirstStudentMonthInfo(
          this.PagePaymentData[index].PaymentMonthlyDetail
        );
      index++;
    }
  }

  SetFirstStudentMonthInfo(Data: any) {
    this.MonthInformation = Data;
  }

  UpdatePagePaymentDetail(
    Detail: Array<PaymentMonthlyDetailModal>,
    ActulaInfo: PaymentDetailModal
  ) {
    if (Detail !== null && ActulaInfo !== null) {
      let Value = Detail.filter(
        (x) => x.PaymentForMonth === Number(ActulaInfo.PaymentForMonth)
      );
      if (Value.length > 0) {
        Value[ZerothIndex].AddedOn =
          ActulaInfo.AddedOn !== "Not Paid"
            ? new Date(ActulaInfo.AddedOn).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : ActulaInfo.AddedOn;
        Value[ZerothIndex].AmountPaid = ActulaInfo.AmountPaid;
        Value[ZerothIndex].FineAmount = 0;
        Value[ZerothIndex].IsPaid = true;
      }
    }
  }

  BindMonths(Index: number, Month: number): Array<PaymentMonthlyDetailModal> {
    let MonthDetailInfo: Array<PaymentMonthlyDetailModal> = [];
    let i = 1;
    while (i <= 12) {
      if (i === Number(Month)) {
        MonthDetailInfo.push({
          PaymentForMonth: Number(this.PaymentDetail[Index].PaymentForMonth),
          MonthName: this.MonthNames[i - 1],
          IsPaid: true,
          ForYear: this.PaymentDetail[Index].ForYear,
          AmountPaid: this.PaymentDetail[Index].AmountPaid,
          FineAmount: 0,
          AddedOn: new Date(
            this.PaymentDetail[Index].AddedOn
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
        });
      } else {
        MonthDetailInfo.push({
          PaymentForMonth: i,
          MonthName: this.MonthNames[i - 1],
          IsPaid: false,
          ForYear: this.PaymentDetail[Index].ForYear,
          AmountPaid: 0,
          FineAmount: 0,
          AddedOn: "Not Paid",
        });
      }
      i++;
    }
    return MonthDetailInfo;
  }

  Makepayment() {}

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

  Reset() {
    this.SelectDefault();
  }

  FiltePaymentDetail() {
    if (this.ClassDetailUid !== null && this.ClassDetailUid !== "") {
      this.LoadData();
    } else {
      this.commonService.ShowToast("Please select Class and Section.");
    }
  }
}

class PaymentDetailModal {
  StudentUid: string;
  PaymentDetailId: string;
  ParentDetailId: string;
  ClassDetailId: string;
  FirstName: string;
  LastName: string;
  ImageUrl: string;
  RegistrationNo: string;
  FeeCode: number;
  PaymentForMonth: number;
  ForYear: number;
  FineCode: number;
  AmountPaid: number;
  AddedOn: string;
  PaymentMonthlyDetail: Array<PaymentMonthlyDetailModal> = [];
}

interface PaymentMonthlyDetailModal {
  PaymentForMonth: number;
  MonthName: string;
  IsPaid: boolean;
  ForYear: number;
  AmountPaid: number;
  FineAmount: number;
  AddedOn: string;
}
