import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  HeaderMenu: Array<any> = [];
  constructor() {}

  ngOnInit() {
    this.HeaderMenu = [
      { name: "Rooms", link: "admin/settings", icon: 'fas fa-hotel', class: 'active'},
      { name: "Class", link: "admin/rooms", icon: 'fas fa-school', class: ''},
      { name: "Exam", link: "admin/rooms", icon: 'far fa-calendar-alt', class: ''},
      { name: "Results", link: "admin/rooms", icon: 'fas fa-chalkboard-teacher', class: ''}
    ]
  }

  toggleMenu() {}
}
