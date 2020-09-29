import { Component, OnInit } from "@angular/core";
import { AjaxService } from "src/providers/ajax.service";
import {
  ServerError,
  SuccessMessage,
  ManageExamDetail,
} from "src/providers/constants";
import {
  NgbDateStruct,
  NgbDateParserFormatter,
  NgbCalendar,
} from "@ng-bootstrap/ng-bootstrap";
import { CalanderFormatter } from "src/providers/CalanderFormatter";
import * as $ from "jquery";
import { iNavigation } from "src/providers/iNavigation";
import {
  CommonService,
  IsValidString,
} from "src/providers/common-service/common.service";

@Component({
  selector: "app-manageexam",
  templateUrl: "./manageexam.component.html",
  styleUrls: ["./manageexam.component.scss"],
  providers: [{ provide: NgbDateParserFormatter, useClass: CalanderFormatter }],
})
export class ManageexamComponent implements OnInit {
  ExpectedDate: NgbDateStruct;
  CurrentExamUid: string;
  ExamName: string;
  Actual: NgbDateStruct;
  EnablePopup: boolean;
  ExamDesc: string;
  ExamDescription: Array<ExamDescriptionModal>;
  $Popup: any;
  constructor(
    private http: AjaxService,
    private commonService: CommonService,
    private calendar: NgbCalendar,
    private nav: iNavigation
  ) {
    this.ExamName = "";
    this.ExamDesc = "";
    this.ExamDescription = [];
    this.EnablePopup = false;
  }

  ngOnInit(): void {
    // this.ExpectedDate = this.calendar.getToday();
    // this.Actual = this.calendar.getToday();
    this.LoadExamDescription();
  }

  LoadExamDescription() {
    this.ExamDescription = [];
    this.http
      .get("AdminMaster/ExamDescription")
      .then((result) => {
        if (IsValidString(result.ResponseBody)) {
          this.ExamDescription = JSON.parse(result.ResponseBody).Table;
          this.commonService.ShowToast(SuccessMessage);
        }
      })
      .catch((err) => {
        this.commonService.ShowToast(ServerError);
      });
  }

  AddNewExam() {
    if (IsValidString(this.ExamName)) {
      this.http
        .post("AdminMaster/InsertExamDetail", {
          ExamName: this.ExamName,
          Description: this.ExamDesc,
        })
        .then((result) => {
          if (IsValidString(result.ResponseBody)) {
            this.ExamName = "";
            this.ExamDesc = "";
            this.ExamDescription = JSON.parse(result.ResponseBody).Table;
            this.commonService.ShowToast(SuccessMessage);
          } else {
            this.commonService.ShowToast(ServerError);
          }
        });
    } else {
      this.commonService.ShowToast("Exam name is required field.");
    }
  }

  SaveChanges() {
    let CurrentExpectedDate = null;
    if (this.ExpectedDate !== undefined && this.ExpectedDate !== null) {
      CurrentExpectedDate = new Date(
        this.ExpectedDate.year,
        this.ExpectedDate.month,
        this.ExpectedDate.day
      );
    }
    let CurrentActualDate = null;
    if (this.Actual !== undefined && this.Actual !== null) {
      CurrentActualDate = new Date(
        this.Actual.year,
        this.Actual.month,
        this.Actual.day
      );
    }

    if (CurrentActualDate === null) {
      this.commonService.ShowToast(
        "Please selecte Expected or Actual exma date."
      );
    } else {
      let ServerObject = {
        ExamDescriptionUid: this.CurrentExamUid,
        ExamName: this.ExamName,
        Description: this.ExamDesc,
        ExpectedDate: CurrentExpectedDate,
        ActualDate: CurrentActualDate,
      };

      this.Close();
      this.http
        .post("AdminMaster/InsertExamDetail", ServerObject)
        .then((result) => {
          if (IsValidString(result.ResponseBody)) {
            this.ExamName = "";
            this.ExamDesc = "";
            this.ExamDescription = JSON.parse(result.ResponseBody).Table;
            this.commonService.ShowToast(SuccessMessage);
          } else {
            this.commonService.ShowToast(ServerError);
          }
        });
    }
  }

  OpenExamDetail(Exam: ExamDescriptionModal) {
    this.nav.navigate(ManageExamDetail, Exam);
  }

  Close() {
    this.ExamName = "";
    this.ExamDesc = "";
    this.EnablePopup = false;
  }

  EditCurrent(Exam: ExamDescriptionModal) {
    if (
      IsValidString(Exam.ExamDescriptionId) &&
      IsValidString(Exam.ExamName) &&
      IsValidString(Exam.Description)
    ) {
      this.CurrentExamUid = Exam.ExamDescriptionId;
      this.ExamName = Exam.ExamName;
      this.ExamDesc = Exam.Description;
      this.EnablePopup = true;
    } else {
      this.commonService.ShowToast("Internal error. Please contact to admin.");
    }
  }

  RemoveErrorField() {
    $(event.currentTarget).removeClass("error-field");
  }

  DeleteCurrent(ExamUid: string) {
    if (IsValidString(ExamUid)) {
      this.CurrentExamUid = ExamUid;
    } else {
      this.commonService.ShowToast("Internal error. Please contact to admin.");
    }
  }
}

interface ExamDescriptionModal {
  ExamDescriptionId: string;
  TanentUid: string;
  ExamId: number;
  ExamName: string;
  ExpectedDate?: Date;
  ActualDate?: Date;
  Description: string;
}
