import { Component, OnInit } from '@angular/core';
import { iNavigation } from 'src/providers/iNavigation';

@Component({
  selector: 'app-managenotice',
  templateUrl: './managenotice.component.html',
  styleUrls: ['./managenotice.component.scss']
})
export class ManagenoticeComponent implements OnInit {
  notificationType: any = {};

  constructor(private nav: iNavigation) { }

  ngOnInit(): void {
    this.notificationType = {
      school: true,
      class: false,
      student: false
    }
    let data = this.nav.getValue();
  }
}
