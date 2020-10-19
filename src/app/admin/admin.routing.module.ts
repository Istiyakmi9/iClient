import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LayoutComponent } from "../layout/layout.component";
import {
  Dashboard,
  Attendence,
  Calendar,
  StaffMemberRegistration,
  FacultyRegistration,
  QuickRegistration,
  StaffRegistration,
  StudentRegistration,
  StudentReports,
  Subjects,
  TimeTable,
  TrackOnMap,
  UploadData,
  VehicleLocation,
  ViewClasses,
  FacultyReports,
  StaffReports,
  ManageTimetable,
  ManageUser,
  Settings,
  AttendanceReport,
  MonthlyAttendance,
  Payments,
  Contacts,
  ManageRoles,
  ProgressReport,
  UploadResults,
  ManageResults,
  ManageExam,
  ManageExamDetail,
  ExamResult,
  Syllabus,
  ManageMenu,
  Grades,
} from "src/providers/constants";
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
import { CalendarComponent } from "../shared/calendar/calendar.component";
import { SyllabusComponent } from "./syllabus/syllabus.component";
import { ManagemenuComponent } from './managemenu/managemenu.component';
import { GradesComponent } from './grades/grades.component';

const adminRoutes: Routes = [
  {
    path: Dashboard,
    component: DashboardComponent,
  },
  { path: Attendence, component: AttendanceComponent },
  { path: Calendar, component: CalendarComponent },
  {
    path: StaffMemberRegistration,
    component: FacultyRegistrationComponent,
  },
  { path: FacultyRegistration, component: FacultyRegistrationComponent },
  { path: QuickRegistration, component: QuickRegistrationComponent },
  { path: StaffRegistration, component: StaffRegistrationComponent },
  { path: StudentRegistration, component: StudentRegistrationComponent },
  { path: StudentReports, component: StudentReportComponent },
  { path: Subjects, component: SubjectsComponent },
  { path: TimeTable, component: TimetableComponent },
  { path: TrackOnMap, component: TrackOnMapComponent },
  { path: UploadData, component: UploadRecordsComponent },
  { path: VehicleLocation, component: VehicleLocationComponent },
  { path: ViewClasses, component: ViewClassesComponent },
  { path: FacultyReports, component: FacultyReportComponent },
  { path: StaffReports, component: StaffReportComponent },
  { path: ManageTimetable, component: ManagetimetableComponent },
  { path: ManageUser, component: ManageuserComponent },
  { path: Settings, component: SettingsComponent },
  { path: AttendanceReport, component: AttendancereportComponent },
  { path: MonthlyAttendance, component: MonthlyAttendanceComponent },
  { path: Payments, component: PaymentsComponent },
  { path: Contacts, component: ContactsComponent },
  { path: ManageRoles, component: ManagerolesComponent },
  { path: ProgressReport, component: ProgressreportComponent },
  { path: UploadResults, component: UploadresultComponent },
  { path: ManageResults, component: ManageresultComponent },
  { path: ManageExam, component: ManageexamComponent },
  { path: ManageExamDetail, component: ManageexamdetailComponent },
  { path: ExamResult, component: ViewResultsComponent },
  { path: Syllabus, component: SyllabusComponent },
  { path: ManageMenu, component: ManagemenuComponent },
  { path: Grades, component: GradesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
})
export class AdminRoutingModule {}
