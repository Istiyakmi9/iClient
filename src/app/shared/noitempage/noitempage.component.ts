import { Component, OnInit, Input } from "@angular/core";
import { IsValidString } from "src/providers/common-service/common.service";

@Component({
  selector: "app-noitempage",
  templateUrl: "./noitempage.component.html",
  styleUrls: ["./noitempage.component.scss"]
})
export class NoitempageComponent implements OnInit {
  PageMessage: string;
  @Input()
  set Data(Message: string) {
    if (IsValidString(Message)) {
      this.PageMessage = Message;
    } else {
      this.PageMessage = "PLEASE SELECTE PROPER INPUT";
    }
  }

  constructor() {}

  ngOnInit(): void {
    if (!IsValidString(this.PageMessage)) {
      this.PageMessage = "PLEASE SELECTE PROPER INPUT";
    }
  }
}
