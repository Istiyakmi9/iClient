import { Login, Dashboard } from "./../providers/constants";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { LayoutComponent } from "./layout/layout.component";

const routes: Routes = [
  {
    path: "admin",
    component: LayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./admin/admin.module").then((m) => m.AdminModule),
      },
    ],
  },
  { path: Login, component: LoginComponent },
  { path: "**", redirectTo: Login },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
