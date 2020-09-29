import { BrowserModule } from "@angular/platform-browser";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AjaxService } from "src/providers/ajax.service";
import { ApplicationStorage } from "src/providers/ApplicationStorage";
import { iNavigation } from "src/providers/iNavigation";
import { PageCache } from "src/providers/PageCache";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { HomeComponent } from "./home/home.component";
import { SideMenuComponent } from "./side-menu/side-menu.component";
import { FloatOnlyDirective } from "src/providers/directives/FloatType";
import { NumberOnlyDirective } from "src/providers/directives/NumberType";
import { MobileNumber } from "src/providers/directives/MobileNumber";
import { NumberDirective } from "src/providers/directives/Number";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { UpperAndLowerCaseDirective } from "src/providers/directives/Upper";
import { CalanderFormatter } from "src/providers/CalanderFormatter";
import { AdminModule } from "./admin/admin.module";
import { LoginComponent } from "./login/login.component";
import { LayoutComponent } from "./layout/layout.component";
import { SharedModule } from "./shared/shared.module";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SideMenuComponent,
    FloatOnlyDirective,
    NumberOnlyDirective,
    MobileNumber,
    NumberDirective,
    UpperAndLowerCaseDirective,
    LoginComponent,
    LayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    AdminModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    AjaxService,
    ApplicationStorage,
    iNavigation,
    PageCache,
    CalanderFormatter,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
