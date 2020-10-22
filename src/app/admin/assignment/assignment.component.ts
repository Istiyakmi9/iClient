import { Component, OnInit } from '@angular/core';
import { ClassDetail } from 'src/app/app.component';
import { ApplicationStorage } from 'src/providers/ApplicationStorage';
import { CommonService, IsValidResponse, IsValidType } from 'src/providers/common-service/common.service';
import * as $ from 'jquery';
import { AjaxService } from 'src/providers/ajax.service';
import { SearchModal } from '../student-report/student-report.component';
import { AssignmentColumn, ZerothIndex } from 'src/providers/constants';
import { ITable } from 'src/providers/Generic/Interface/ITable';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.scss']
})
export class AssignmentComponent implements OnInit {
  faculties: Array<any>;
  ClassDetail: Array<ClassDetail>;
  Classes: Array<string>;
  Sections: Array<ClassDetail>;
  IsReady: boolean;
  searchModal: SearchModal;
  gridData: Array<any>;
  totalCount: number;
  GridData: ITable;
  
  constructor(private storage: ApplicationStorage, private commonService: CommonService, 
    private http: AjaxService) { }

  ngOnInit(): void {
    this.faculties = [];
    this.ClassDetail = this.storage.GetClassDetail();
    this.Classes = this.storage.GetClasses();
    this.searchModal = new SearchModal();
    this.loadData();
  }

  loadData() {
    this.http.post("Assignment/GetAssignment", this.searchModal).then(response => {
      if(this.commonService.IsValidResponse(response)) {
        this.gridData = [];
        let parseData = JSON.parse(response.ResponseBody);
        if(parseData !== null) {
          this.gridData = parseData["Table"];
          this.totalCount = parseData["Table1"][ZerothIndex]["Total"];

          this.GridData = {
            headers: AssignmentColumn,
            rows: this.gridData,
            totalCount: this.totalCount,
            pageIndex: this.searchModal.PageIndex,
            pageSize: this.searchModal.PageSize,
            url: "",
          };
          this.IsReady = true;
        }
      } else {
        this.commonService.ShowToast("Server error. Please contact admin.");
      }
    }).catch(e => {
      console.log(e);
    })
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

  OnFacultySelected(elem: any) {

  }

  FilterLocaldata(){}

  ResetFilter(){}

  GetAdvanceFilter(){}

  OnEdit(e: any) {
    alert(e);
  }

  OnDelete(e: any) {
    alert(e);
  }

  NextPage(e: any){}

  PreviousPage(e: any){}
}
