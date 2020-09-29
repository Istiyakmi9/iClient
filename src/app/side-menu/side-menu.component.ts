import { iNavigation } from "./../../providers/iNavigation";
import { Component, OnInit } from "@angular/core";
import { AjaxService } from "src/providers/ajax.service";
import * as $ from "jquery";
import { CommonService } from "../../providers/common-service/common.service";
import { PageCache } from "./../../providers/PageCache";
import { ApplicationStorage } from "src/providers/ApplicationStorage";
import { Router } from "@angular/router";
import { DefaultUserImage } from "src/providers/constants";

@Component({
  selector: "app-side-menu",
  templateUrl: "./side-menu.component.html",
  styleUrls: ["./side-menu.component.scss"],
})
export class SideMenuComponent implements OnInit {
  CompanyName: string = "Sana Computers";
  MenuList: Array<ISideMenu> = [];
  IsActionBindingDone: boolean = false;
  CurrentUser: any = null;
  UserImage: string;
  RoleName: string;
  constructor(
    private commonService: CommonService,
    private ajax: AjaxService,
    private cache: PageCache,
    private local: ApplicationStorage,
    private router: Router,
    private nav: iNavigation
  ) {
    this.UserImage = DefaultUserImage;
    this.RoleName = this.nav.GetRoleName() + "/";
    //this.LoadMenu();
  }

  CleanUpCache() {
    this.nav.resetValue();
    return true;
  }

  BuildMenu(Catagory: string, MenuItems: Array<ISideMenu>): Array<ISideMenu> {
    let Items: Array<ISideMenu> = null;
    if (Catagory === null) {
      Items = MenuItems.filter((x) => x.Childs === null);
    } else {
      Items = MenuItems.filter((x) => x.Childs === Catagory);
    }

    let FilteredItem: Array<ISideMenu>;
    if (Items.length > 0) {
      let index = 0;
      while (index < Items.length) {
        FilteredItem = this.BuildMenu(Items[index].Catagory, MenuItems);
        if (FilteredItem !== null) {
          if (typeof Items[index]["SubCatagory"] === "undefined") {
            Items[index]["SubCatagory"] = [];
          }
          let innerIndex = 0;
          while (innerIndex < FilteredItem.length) {
            Items[index]["SubCatagory"].push(FilteredItem[innerIndex]);
            innerIndex++;
          }
        }
        index++;
      }
    } else {
      Catagory = null;
    }

    return Items;
  }

  ngOnInit() {
    let Data = this.commonService.GetApplicationMenu();
    let MenuItem: Array<ISideMenu>;
    if (Data !== undefined && Data !== null) {
      this.MenuList = Data.filter((x) => x.Childs === null);
      let ChildMenu = Data.filter((x) => x.Childs !== null);
      this.MenuList = this.BuildMenu(null, Data);
      if (!this.BindUser()) {
        this.local.clear();
        this.cache.clear();
        this.router.navigate(["/"]);
      }
    }
  }

  BindUser(): boolean {
    let flag = true;
    this.CurrentUser = this.local.GetCurrentUser();
    if (this.CurrentUser === null) {
      this.commonService.HideLoader();
      this.commonService.ShowToast(
        "Unable to get user detail. Please contact to admin."
      );
      flag = false;
    }
    return flag;
  }

  ngAfterViewInit() {
    this.commonService.ShowLoader();
    this.HandleMenu();
    if (this.BindUser()) {
      this.commonService.HighlightNavMenu();
      this.commonService.HideLoader();
    } else {
      this.local.clear();
      this.cache.clear();
      this.router.navigate(["/"]);
    }
  }

  LogoutSesstion() {
    this.local.clear();
    this.cache.clear();
    this.router.navigate(["/"]);
    this.commonService.ShowToast("Logout successfully.");
  }

  HandleMenu() {
    $(".sidebar-dropdown > a").click(function () {
      $(".sidebar-submenu").slideUp(200);
      if ($(this).parent().hasClass("active")) {
        $(".sidebar-dropdown").removeClass("active");
        $(this).parent().removeClass("active");
      } else {
        $(".sidebar-dropdown").removeClass("active");
        // $(".sidebar-dropdown li").removeClass("active active-list");
        $(".sidebar-dropdown a").removeClass("active");
        $(this).next(".sidebar-submenu").slideDown(200);
        $(this).addClass("active").parent().addClass("active");
      }
    });

    $('li[type="action"]').click(function () {
      $('li[type="action"]').removeClass("active active-list");
      $(this).addClass("active active-list");
    });

    $("#close-sidebar").click(function () {
      $(".page-wrapper").removeClass("toggled");
    });
    $("#show-sidebar").click(function () {
      $(".page-wrapper").addClass("toggled");
    });
  }
}

interface ISideMenu {
  Badge: string;
  BadgeType: string;
  Catagory: string;
  Childs: string;
  Icon: string;
  Link: string;
  SubCatagory: Array<ISideMenu>;
}
