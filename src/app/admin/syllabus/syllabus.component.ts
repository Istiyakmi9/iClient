import { Component, OnInit } from "@angular/core";
import { ClassDetail } from "src/app/app.component";
import {
  IsValidType,
  CommonService,
} from "src/providers/common-service/common.service";
import * as $ from "jquery";
import { ApplicationStorage } from "src/providers/ApplicationStorage";
import { SearchModal } from "../student-report/student-report.component";

@Component({
  selector: "app-syllabus",
  templateUrl: "./syllabus.component.html",
  styleUrls: ["./syllabus.component.scss"],
})
export class SyllabusComponent implements OnInit {
  Sections: Array<ClassDetail>;
  ClassDetailUid: string;
  Classes: Array<string>;
  ClassDetail: Array<ClassDetail>;
  Class: string;
  SearchQuery: SearchModal;

  constructor(
    private commonService: CommonService,
    private storage: ApplicationStorage
  ) {
    this.Class = "";
    this.ClassDetailUid = "";
  }

  ngOnInit(): void {
    this.ClassDetail = this.storage.GetClassDetail();
    this.InitQuery();
    this.LoadData();
  }

  InitQuery() {
    this.ClassDetailUid = "";
    this.Classes = this.storage.GetClasses();
    this.SearchQuery = {
      SearchString: " 1=1 ",
      SortBy: "",
      PageIndex: 1,
      PageSize: 15,
    };
  }

  LoadData() {}

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

  GetAdvanceFilter() {}

  ResetFilter() {}

  FilterLocaldata() {}
}
