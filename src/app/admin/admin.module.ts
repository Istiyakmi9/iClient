import { NgModule } from "@angular/core";
import { GoogleMapsModule } from "@angular/google-maps";
import { CommonModule } from "@angular/common";
import { AdminRoutingModule } from "./admin.routing.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AttendanceComponent } from "./attendance/attendance.component";
import { FacultyRegistrationComponent } from "./faculty-registration/faculty-registration.component";
import { QuickRegistrationComponent } from "./quick-registration/quick-registration.component";
import { StaffRegistrationComponent } from "./staff-registration/staff-registration.component";
import { StudentRegistrationComponent } from "./student-registration/student-registration.component";
import { StudentReportComponent } from "./student-report/student-report.component";
import { SubjectsComponent } from "./subjects/subjects.component";
import { TimetableComponent } from "./timetable/timetable.component";
import { TrackOnMapComponent } from "../track-on-map/track-on-map.component";
import { UploadRecordsComponent } from "../upload-records/upload-records.component";
import { VehicleLocationComponent } from "./vehicle-location/vehicle-location.component";
import { ViewClassesComponent } from "./view-classes/view-classes.component";
import { FacultyReportComponent } from "./faculty-report/faculty-report.component";
import { StaffReportComponent } from "./staff-report/staff-report.component";
import { ManagetimetableComponent } from "./managetimetable/managetimetable.component";
import { ManageuserComponent } from "./manageuser/manageuser.component";
import { SettingsComponent } from "./settings/settings.component";
import { AttendancereportComponent } from "./attendancereport/attendancereport.component";
import { MonthlyAttendanceComponent } from "./monthly-attendance/monthly-attendance.component";
import { PaymentsComponent } from "./payments/payments.component";
import { ContactsComponent } from "./contacts/contacts.component";
import { ManagerolesComponent } from "./manageroles/manageroles.component";
import { ProgressreportComponent } from "./progressreport/progressreport.component";
import { UploadresultComponent } from "../uploadresult/uploadresult.component";
import { ManageresultComponent } from "./manageresult/manageresult.component";
import { ManageexamComponent } from "./manageexam/manageexam.component";
import { ManageexamdetailComponent } from "./manageexamdetail/manageexamdetail.component";
import { ViewResultsComponent } from "./view-results/view-results.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CalendarComponent } from "../shared/calendar/calendar.component";
import { SharedModule } from "../shared/shared.module";
import { NumberSufix } from "src/providers/filters/NumberSufix";
import { SyllabusComponent } from "./syllabus/syllabus.component";
// import { CalendarModule, DateAdapter } from "angular-calendar";
// import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { ManagemenuComponent } from './managemenu/managemenu.component';
import { GradesComponent } from './grades/grades.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { FullCalendarModule } from '@fullcalendar/angular'
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin
]);


@NgModule({
  declarations: [
    DashboardComponent,
    AttendanceComponent,
    CalendarComponent,
    FacultyRegistrationComponent,
    FacultyRegistrationComponent,
    QuickRegistrationComponent,
    StaffRegistrationComponent,
    StudentRegistrationComponent,
    StudentReportComponent,
    SubjectsComponent,
    TimetableComponent,
    TrackOnMapComponent,
    UploadRecordsComponent,
    VehicleLocationComponent,
    ViewClassesComponent,
    FacultyReportComponent,
    StaffReportComponent,
    ManagetimetableComponent,
    ManageuserComponent,
    SettingsComponent,
    AttendancereportComponent,
    MonthlyAttendanceComponent,
    PaymentsComponent,
    ContactsComponent,
    ManagerolesComponent,
    ProgressreportComponent,
    UploadresultComponent,
    ManageresultComponent,
    ManageexamComponent,
    ManageexamdetailComponent,
    ViewResultsComponent,
    NumberSufix,
    SyllabusComponent,
    ManagemenuComponent,
    GradesComponent,
    AssignmentComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    // CalendarModule.forRoot({
    //   provide: DateAdapter,
    //   useFactory: adapterFactory,
    // }),
    GoogleMapsModule,
    FullCalendarModule,
  ],
})
export class AdminModule {}
