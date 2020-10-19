import {
  ZerothIndex,
  ServerError,
  SuccessMessage,
} from "src/providers/constants";
import { FormBuilder, FormControl } from "@angular/forms";
import { FormGroup, FormArray } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import {
  CommonService,
  IsValidType,
  IsValidString,
} from "src/providers/common-service/common.service";
import * as $ from "jquery";
import { AjaxService } from "src/providers/ajax.service";

@Component({
  selector: "app-manageroles",
  templateUrl: "./manageroles.component.html",
  styleUrls: ["./manageroles.component.scss"],
})
export class ManagerolesComponent implements OnInit {
  MenuAndRoles: FormGroup;
  MenuList: Array<any>;
  CompleteMenuList: Array<any>;
  IsReady: boolean;
  ActiveMenus: Array<any>;
  RoleName: string;
  RoleDesc: string;
  ExchangeButtonLabel: string;
  AccessLevelUid: string;
  AccessRoles: any;
  IsNew: boolean;
  get MenuAndRolesData(): FormArray {
    return this.MenuAndRoles.get("MenuAndRolesData") as FormArray;
  }
  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private http: AjaxService
  ) {
    this.RoleName = "";
    this.RoleDesc = "";
    this.IsReady = false;
    this.ActiveMenus = [];
    this.MenuList = [];
    this.CompleteMenuList = [];
  }

  ngOnInit() {
    this.IsNew = true;
    this.GetRoles();
    this.AccessLevelUid = "";
    this.ExchangeButtonLabel = "Modify Existing";
    // let Data = this.commonService.GetApplicationMenu();
    // if (Data !== undefined && Data !== null) {
    //   this.MenuList = Data;
    //   this.InitData();
    //   this.IsReady = true;
    // }
  }

  GetRoles() {
    this.http.get("AdminMaster/GetRoles").then((result) => {
      if (IsValidType(result.ResponseBody)) {
        let Data = JSON.parse(result.ResponseBody);
        if (
          Data["MenuByRoles"] !== "undefined" &&
          Data["FullMenu"]["Table"] !== "undefined" &&
          Data["FullMenu"] !== "undefined" &&
          Data["MenuByRoles"]["Table"] !== "undefined"
        ) {
          this.MenuList = Data["FullMenu"]["Table"];
          this.CompleteMenuList = this.MenuList;
          this.AccessRoles = Data["MenuByRoles"]["Table"];
          this.InitData();
          this.commonService.ShowToast(SuccessMessage);
          this.IsReady = true;
        } else {
          this.commonService.ShowToast(ServerError);
        }
      } else {
        this.commonService.ShowToast(ServerError);
      }
    });
  }

  ChangeLabel() {
    if (this.IsNew) {
      $("#newrole").hide();
      $("#existingrole").fadeIn();
      this.ExchangeButtonLabel = "Add New Role";
      this.IsReady = false;
    } else {
      this.ExchangeButtonLabel = "Modify Existing";
      $("#existingrole").hide();
      $("#newrole").fadeIn();
      this.IsReady = true;
    }
    this.IsNew = !this.IsNew;
  }

  ManageExistingMenu() {
    if (IsValidType(this.MenuList)) {
      let MenuItem = null;

      let index = 0;
      while(index < this.CompleteMenuList.length) {
        this.CompleteMenuList[index].IsActive = false;
        index++;
      }

      this.MenuList.map((item, index) => {
        MenuItem = this.CompleteMenuList.filter(
          (x) => x.Catagory === item.Catagory
        );
        if (MenuItem.length > 0)
          MenuItem[ZerothIndex].IsActive = true;
      });
    }
    this.MenuList = this.CompleteMenuList;
    this.InitData();
  }

  BindRole() {
    if (IsValidString(this.AccessLevelUid)) {
      this.HandleRoleNameAndDescription();
      this.http
        .get(
          `AdminMaster/RolesByAccessLevel?AccessLevelUid=${this.AccessLevelUid}`
        )
        .then((result) => {
          if (IsValidString(result.ResponseBody)) {
            this.MenuList = JSON.parse(result.ResponseBody).Table;
            this.ManageExistingMenu();
            this.commonService.ShowToast(SuccessMessage);
          } else {
            this.commonService.ShowToast(ServerError);
          }
        })
        .catch((err) => {});
    } else {
      this.commonService.ShowToast("Invalid role name selected.");
    }
  }

  InitData() {
    this.MenuAndRoles = this.fb.group({
      MenuAndRolesData: this.fb.array(this.InitializeFormArray()),
    });
    this.IsReady = true;
  }

  InitializeFormArray(): Array<FormGroup> {
    let index = 0;
    let Flag = false;
    let MenuData: Array<FormGroup> = [];
    if (IsValidType(this.MenuList)) {
      while (index < this.MenuList.length) {
        if (
          this.MenuList[index]["IsActive"] === 1 ||
          this.MenuList[index]["IsActive"] === true
        )
          Flag = true;
        else Flag = false;
        MenuData.push(
          this.BuildFormGroup({
            MenuName: this.MenuList[index].Catagory,
            AccessLevelUid: "",
            PermissionLevel: 1,
            AccessCode: this.MenuList[index].AccessCode,
            Link: this.MenuList[index].Link,
            Childs: this.MenuList[index].Childs,
            IsActive: Flag,
          })
        );
        index++;
      }
    }
    return MenuData;
  }

  BuildFormGroup(MenuData: MenuAndRolesModal) {
    return this.fb.group({
      MenuName: new FormControl(MenuData.MenuName),
      AccessLevelUid: new FormControl(MenuData.AccessLevelUid),
      PermissionLevel: new FormControl(MenuData.PermissionLevel),
      AccessCode: new FormControl(MenuData.AccessCode),
      Link: new FormControl(MenuData.Link),
      Childs: new FormControl(MenuData.Childs),
      IsActive: new FormControl(MenuData.IsActive),
    });
  }

  ToggleItem(MenuName: string) {
    let RolesAndMenu = this.MenuAndRoles.get("MenuAndRolesData").value;
    let CurrentItem = RolesAndMenu.filter((x) => x.MenuName === MenuName);
    if (CurrentItem.length > 0) {
      CurrentItem[ZerothIndex].IsActive = !CurrentItem[ZerothIndex].IsActive;
    }

    let Flag = false;
    let $e = $(event.currentTarget).find('div[name="slider"]');
    if ($e.hasClass("off")) {
      $e.removeClass("off");
      Flag = true;
    } else {
      $e.addClass("off");
    }

    // if (this.ActiveMenus.filter((x) => x.Name === MenuName).length > 0) {
    //   if (!Flag) {
    //     this.ActiveMenus = this.ActiveMenus.filter((x) => x.Name !== MenuName);
    //   }
    // } else {
    //   this.ActiveMenus.push({
    //     Name: MenuName,
    //     PermissionLevel: 1,
    //   });
    // }
  }

  ChangePermission(MenuName: string) {
    let Menus = this.ActiveMenus.filter((x) => x.Name === MenuName);
    if (Menus.length > 0) {
      let CurrentValue = $(event.currentTarget).val();
      try {
        CurrentValue = parseInt(CurrentValue);
      } catch (e) {
        CurrentValue = 1;
      }
      let Menu = Menus[ZerothIndex];
      Menu.PermissionLevel = CurrentValue;
    }
  }

  HandleRoleNameAndDescription() {
    if (IsValidString(this.AccessLevelUid)) {
      let AccessRole = this.AccessRoles.filter(
        (x) => x.AccessLevelId === this.AccessLevelUid
      );
      if (AccessRole.length > 0) {
        this.RoleName = AccessRole[ZerothIndex].Roles;
        this.RoleDesc = AccessRole[ZerothIndex].AccessCodeDefination;
      }
    }
  }

  SaveAndUpdateChanges() {
    if (this.IsNew) {
      if (this.RoleName === null || this.RoleName === "") {
        this.commonService.ShowToast("Role name is mandatory.");
        return;
      }
    } else if (!IsValidString(this.AccessLevelUid)) {
      this.commonService.ShowToast("Please select and modify any role.");
      return;
    }
    // if (this.ActiveMenus.length > 0) {
    // let MenuControls = this.MenuAndRoles.get("MenuAndRolesData") as FormArray;
    // let MenuControlItem = [];
    // let Item: FormControl = null;
    // let index = 0;
    // while (index < this.ActiveMenus.length) {
    //   MenuControlItem = MenuControls.controls.filter(
    //     (x) => x.value.MenuName === this.ActiveMenus[index].Name
    //   );
    //   if (MenuControlItem.length > 0) {
    //     Item = MenuControlItem[ZerothIndex];
    //     Item.get("PermissionLevel").setValue(
    //       this.ActiveMenus[index].PermissionLevel
    //     );
    //     Item.get("IsActive").setValue(true);
    //   }
    //   index++;
    // }

    let ServerObject: MenuAndRoles = {
      AccessLevelUid: this.AccessLevelUid,
      AccessCode: 0,
      RoleName: this.RoleName,
      RoleDescription: this.RoleDesc,
      MenuAndRolesModal: this.MenuAndRoles.get("MenuAndRolesData").value,
    };

    this.http
      .post("AdminMaster/AddUpdateRoles", ServerObject)
      .then((result) => {
        if (IsValidType(result)) {
          this.commonService.ShowToast(SuccessMessage);
        } else {
          this.commonService.ShowToast(ServerError);
        }
      })
      .catch((err) => {
        this.commonService.ShowToast(ServerError);
      });
    // } else {
    //   this.commonService.ShowToast("No menu item selected.");
    // }
  }
}

interface MenuAndRolesModal {
  MenuName: string;
  AccessLevelUid: string;
  PermissionLevel: number;
  AccessCode: number;
  Link: string;
  Childs: string;
  IsActive: boolean;
}

interface MenuAndRoles {
  AccessLevelUid: string;
  AccessCode: number;
  RoleName: string;
  RoleDescription: string;
  MenuAndRolesModal: Array<MenuAndRolesModal>;
}
