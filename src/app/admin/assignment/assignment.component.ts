import { Component, OnInit } from '@angular/core';
import { ClassDetail } from 'src/app/app.component';
import { ApplicationStorage } from 'src/providers/ApplicationStorage';
import { CommonService, IsValidResponse, IsValidString, IsValidType } from 'src/providers/common-service/common.service';
import * as $ from 'jquery';
import { AjaxService } from 'src/providers/ajax.service';
import { SearchModal } from '../student-report/student-report.component';
import { AssignmentColumn, ZerothIndex } from 'src/providers/constants';
import { ITable } from 'src/providers/Generic/Interface/ITable';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

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
  AssigmentForm: FormGroup;
  
  constructor(private storage: ApplicationStorage, private commonService: CommonService, 
    private http: AjaxService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.BuildForm();
    this.faculties = [];
    this.ClassDetail = this.storage.GetClassDetail();
    this.Classes = this.storage.GetClasses();
    this.searchModal = new SearchModal();
    this.LoadData();
  }

  BuildForm() {
    this.AssigmentForm = this.fb.group({
      Class: new FormControl(''),
      ClassDetailUid: new FormControl(''),
      FacultyUid: new FormControl(''),
      Title: new FormControl(''),
      Description: new FormControl(''),
      SubmissionDate: new FormControl(''),
    });
  }

  createAssignment(){
    if(this.AssigmentForm != null) {
      alert(JSON.stringify(this.AssigmentForm.value));
      this.http.post('Assignment/CreateNewAssignment', this.AssigmentForm.value).then(response => {
        if(IsValidResponse(response.ResponseBody)) {

        } else {
          this.commonService.ShowToast('Server error. Please contact to admin');
        }
      })
    }
  }

  LoadData() {
    this.http.post("Assignment/GetAssignment", this.searchModal).then(response => {
      if(this.commonService.IsValidResponse(response)) {
        this.gridData = [];
        let parseData = JSON.parse(response.ResponseBody);
        if(parseData !== null) {
          this.gridData = parseData["Table"];
          this.totalCount = parseData["Table1"][ZerothIndex]["Total"];
          this.BuildFaculty(parseData["Table2"]);

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

  BuildFaculty(facultyData: Array<any>) {
    this.faculties = [];
    if(facultyData != null && facultyData.length > 0){
      let index = 0;
      while(index < facultyData.length) {
        this.faculties.push({
          value: facultyData[index],
          text: `${facultyData[index]['FirstName']} ${facultyData[index]['LastName']}`
        });
        index++;
      }
    }
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
    let data = JSON.parse(elem);
    if(IsValidType(data)) {
      let currentStaffUid = data.value.StaffMemberUid;
      if(IsValidString(currentStaffUid)) {
        this.AssigmentForm.controls['FacultyUid'].setValue(currentStaffUid);
      }
    }
  }

  GetFilteredData(){
    let value = $('#filter').val();
    this.searchModal.SearchString = `1=1 and (title like '${value}%' or taskDescription like '${value}%')`;
    this.LoadData();
  }

  ResetFilter(){
    this.searchModal.SearchString = `1=1`;
    this.searchModal.PageIndex = 1;
    this.LoadData();
  }

  GetAdvanceFilter(){}

  OnEdit(e: any) {
    alert(e);
  }

  OnDelete(e: any) {
    alert(e);
  }

  NextPage(e: any){
    let data = JSON.parse(e);
    if(data != null){
      let nextIndex = data.PageIndex;
      this.searchModal.PageIndex = nextIndex;
      this.LoadData();
    }
  }

  PreviousPage(e: any){}
}
