import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'src/providers/ajax.service';
import { BuildGrid, CommonService } from 'src/providers/common-service/common.service';
import { ServerError } from 'src/providers/constants';
import { SearchModal } from '../student-report/student-report.component';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit {
  GridData: any;
  SearchQuery: SearchModal;

  constructor(private http: AjaxService, private common: CommonService) { }

  ngOnInit(): void {
    this.GridData = null;
    this.SearchQuery = new SearchModal();
    this.loadData();
  }

  loadData() {
    this.http.post("Announcement/fetchannouncement", {
      "searchModal": this.SearchQuery,
      "ClassDetailUid": "",
      "StudentUid": "1523370181157"
    }).then(response => {
      this.GridData = BuildGrid(response, this.SearchQuery);
    });
  }

  FilterLocaldata() {}

  ResetFilter(){}

  GetAdvanceFilter(){}
}
