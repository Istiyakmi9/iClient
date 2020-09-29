import { Component, OnInit } from "@angular/core";
import { CommonService } from "src/providers/common-service/common.service";

@Component({
  selector: "app-page-bread-crum",
  templateUrl: "./page-bread-crum.component.html",
  styleUrls: ["./page-bread-crum.component.scss"]
})
export class PageBreadCrumComponent implements OnInit {
  BreadCrumbData: Array<string> = [];
  constructor(private commonService: CommonService) {}

  ngOnInit() {
    this.BreadCrumbData = this.commonService.GetBreadCrumbRoute();
  }
}
