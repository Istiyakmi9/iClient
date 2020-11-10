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
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { UpperAndLowerCaseDirective } from "src/providers/directives/Upper";
import { CalanderFormatter } from "src/providers/CalanderFormatter";
// import { AdminModule } from "./admin/admin.module";
import { LoginComponent } from "./login/login.component";
import { LayoutComponent } from "./layout/layout.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HeaderComponent } from './shared/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SideMenuComponent,
    FloatOnlyDirective,
    NumberOnlyDirective,
    LoginComponent,
    LayoutComponent,
    UpperAndLowerCaseDirective,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
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
