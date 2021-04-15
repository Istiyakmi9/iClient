import { ExamResult, ManageExamDetail, ManageExam, Pdf, Doc, Txt, Zip, Excel, FlatFile, Total, Rows, Columns, ZerothIndex, Ppt } from "./../constants";
import { Injectable } from "@angular/core";
import * as $ from "jquery";
import { FormGroup } from "@angular/forms";
import { FormControl } from "@angular/forms";
import { MappedActionPage } from "./../MappedActionPage";

const AllowedKey = [8, 9, 46];
@Injectable({
  providedIn: "root"
})
export class CommonService {
  LoaderEnableByAjax: boolean = false;
  LoaderEnableByPageNavigator: boolean = false;
  private CurrentPageName: string;
  private IsLoginSuccess: boolean;
  private ApplicationMenu: any;
  private DefaultUserImagePath: string = "assets/img/user.jpg";
  private PageDetail: Array<MappedActionPage> = [];
  private BreadCrumbData: Array<string> = [];
  ErrorControlId: Array<string> = [];
  constructor() {
    this.IsLoginSuccess = false;
  }

  public SetLoginStatus(Status: boolean) {
    if (Status === true) {
      this.IsLoginSuccess = true;
    }
  }

  public UpdateBreadCrumb(PageRouteNames: string) {
    if (PageRouteNames !== null && PageRouteNames) {
      let Data: Array<string> = PageRouteNames.split("/");
      this.BreadCrumbData = [];
      let index = 0;
      while (index < Data.length) {
        if (Data[index] !== "") this.BreadCrumbData.push(Data[index]);
        index++;
      }
    }
  }

  public GetBreadCrumbRoute() {
    if (this.BreadCrumbData !== null && this.BreadCrumbData.length > 0) {
      return this.BreadCrumbData;
    } else {
      return [];
    }
  }

  public GetLoginStatus() {
    return this.IsLoginSuccess;
  }

  public SetCurrentPageName(Name: string) {
    if (IsValidString(Name)) {
      this.CurrentPageName = Name;
    }
    this.LoadMappingInitialData();
  }

  public IsValidResponse(Data: any) {
    let Flag = false;
    if(Data !== null) {
      let DataType = typeof Data;
      let OriginalData = Data;
      if (DataType === "string") {
        OriginalData = JSON.parse(Data);
      }
      if (OriginalData !== null) {
        let Keys = Object.keys(OriginalData);
        if (Keys.length > 0 && Keys.indexOf("HttpStatusCode") !== -1) {
          if (Data["HttpStatusCode"] === 200) {
            Flag = true;
          }
        }
      }
    }
    return Flag;
  }

  public SetApplicationMenu() {
    let key = "Menu";
    this.ApplicationMenu = null;
    let Data = localStorage.getItem("master");
    let ResultingData = null;
    if (this.IsValid(Data)) {
      Data = JSON.parse(Data);
      let DataKeys = Object.keys(Data);
      if (DataKeys.length > 0) {
        let index = 0;
        while (index < DataKeys.length) {
          if (DataKeys[index].toLocaleLowerCase() === key.toLocaleLowerCase()) {
            ResultingData = Data[DataKeys[index]];
            break;
          }
          index++;
        }
      }
    }
    if (this.IsValid(ResultingData) && ResultingData.length > 0) {
      // let MenuData = JSON.parse(ResultingData[0].Menu);
      // if (this.IsValid(MenuData)) {
      //   this.ApplicationMenu = MenuData;
      // }

      this.ApplicationMenu = ResultingData;
    }
  }

  public GetApplicationMenu(): any {
    this.SetApplicationMenu();
    return this.ApplicationMenu;
  }

  public GetCurrentPageName() {
    return this.CurrentPageName;
  }

  public DefaultUserImage(): string {
    return this.DefaultUserImagePath;
  }

  public IsValid(Value): boolean {
    let Flag: boolean = false;
    if (
      Value !== null &&
      Value !== undefined &&
      Value !== "" &&
      Value !== "{}"
    ) {
      let ValueDataType = typeof Value;
      if (ValueDataType !== "undefined") {
        if (ValueDataType === "string") {
          if (Value.trim().length > 0) {
            Flag = true;
          }
        } else if (ValueDataType === "object") {
          if (Array.isArray(Value)) {
            if (Value.length > 0) Flag = true;
          } else if (Value instanceof Date) {
            Flag = true;
          } else {
            if (Object.keys(Value).length > 0) Flag = true;
          }
        }
      }
    }
    return Flag;
  }

  public NumericOnly(e: any): boolean {
    let flag = false;
    if (e >= 48 && e <= 57) flag = true;
    return flag;
  }

  public IsValidField(Columns): boolean {
    let Data = Columns;
    let flag = false;
    if ((Data !== null && Data !== "" && Data !== undefined) || Data !== "{}") {
      let Type = typeof Data;
      if (Type === "string") {
        if (Data.trim().length > 0) flag = true;
      } else if (Type === "object") {
        if (Array.isArray(Data)) {
          if (Data.length > 0) flag = true;
        } else {
          if (Object.keys(Data).length > 0) flag = true;
        }
      }
    }
    return flag;
  }

  ValidateField(formid: string) {
    $("#" + formid)
      .find("*[required]")
      .blur(($event: any) => {
        if ($($event.target).is("input")) {
          if (this.IsValidField($(event.currentTarget).val())) {
            $(event.currentTarget)
              .removeClass("error-field")
              .addClass("success-field");
          } else {
            $(event.currentTarget)
              .removeClass("success-field")
              .addClass("error-field");
          }
        }
      });
  }

  public IsMoney(value: any) {
    let flag = true;
    if (!this.IsNumeric(value)) {
      if (value != ".") {
        flag = false;
      }
    }
    return flag;
  }

  public IsValidDataSet(Dataset: string): boolean {
    let flag = false;
    if (Dataset !== null && Dataset !== "") {
      let Keys = Object.keys(Dataset);
      if (Keys.length > 0) {
        flag = true;
      }
    }
    return flag;
  }

  public IsValidFilterResponse(Dataset: string): boolean {
    let flag = false;
    if (Dataset !== null && Dataset !== "") {
      let Keys = Object.keys(Dataset);
      if (Keys.length === 2) {
        if (
          Keys.indexOf("Record") !== -1 &&
          Keys.indexOf("RecordCount") !== -1
        ) {
          flag = true;
        } else {
          this.ShowToast("Getting some error. Please contact admin.");
        }
      }
    }
    return flag;
  }

  public ValidateForm(Keys): any {
    let $elem = null;
    let IsValidForm = 0;
    let index = 0;
    while (index < Keys.length) {
      $elem = $("#" + Keys[index]);
      if (this.IsValid($elem.attr("required"))) {
        if ($elem.val() != null) {
          if ($elem.val().trim().length == 0) {
            $elem.addClass("error-field");
            IsValidForm++;
          }
        }
      }
      index++;
    }
    return IsValidForm;
  }

  public IsNumeric(data: any): boolean {
    let flag = false;
    try {
      let integerData = parseInt(data);
      if (!isNaN(integerData)) flag = true;
      else flag = false;
    } catch (e) {
      return false;
    }
    return flag;
  }

  public ValidateFormGroup(purchaseFormGroup: FormGroup): any {
    let FormData = {};
    if (typeof purchaseFormGroup["controls"] !== "undefined") {
      if (Array.isArray(purchaseFormGroup.controls)) {
        let ControlData: any = purchaseFormGroup.controls;
        let ValidArrayData = ControlData.filter(x => x.touched === true);
        let ValuedArrayData = [];
        let index = 0;
        while (index < ValidArrayData.length) {
          ValuedArrayData[index] = this.ValidateFormGroup(
            ValidArrayData[index]
          );
          index++;
        }
        return ValuedArrayData;
      } else {
        let AllKeys: Array<string> = Object.keys(purchaseFormGroup.controls);
        let keyIndex = 0;
        while (keyIndex < AllKeys.length) {
          let InnerForm: any = purchaseFormGroup.controls[AllKeys[keyIndex]];
          if (typeof InnerForm["controls"] !== "undefined") {
            FormData[AllKeys[keyIndex]] = this.ValidateFormGroup(InnerForm);
          } else {
            if (InnerForm.errors !== null) {
              if (InnerForm.errors.required && InnerForm.value === "") {
                if (this.ErrorControlId.indexOf(AllKeys[keyIndex]) === -1) {
                  this.ErrorControlId.push(AllKeys[keyIndex]);
                }
              } else {
                FormData[AllKeys[keyIndex]] = InnerForm.value;
              }
            } else {
              if (AllKeys[keyIndex] === "ItemName") {
                this.ReadAutoCompleteValue($("#CustomerByName"));
              } else if (AllKeys[keyIndex] === "Description") {
              }
              if (AllKeys[keyIndex] === "BrandName") {
              }
              FormData[AllKeys[keyIndex]] = InnerForm.value;
            }
          }
          keyIndex++;
        }
      }
    } else {
      return purchaseFormGroup;
    }
    return FormData;
  }

  public Scrollto(ToElement: any) {
    $("html, body").animate({ scrollTop: ToElement.position().top }, "slow");
  }

  OtherFilePath(FileExtension: string) {
    let OtherFilePath = null;
    if (FileExtension === "pdf") OtherFilePath = Pdf;
    else if (FileExtension === "doc" || FileExtension === "docx") OtherFilePath = Doc;
    else if (FileExtension === "txt") OtherFilePath = Txt;
    else if (FileExtension === "zip") OtherFilePath = Zip;
    else if (FileExtension === "xls" || FileExtension === "xlsx") OtherFilePath = Excel;
    else if (FileExtension === "ppt" || FileExtension === "pptx") OtherFilePath = Ppt;
    else if (FileExtension == "") OtherFilePath = FlatFile;
    return OtherFilePath;
  }

  public AlphaNumericOnly(event: any) {}

  public AlphaOnly(event: any) {}

  public DateFormat(event: any) {}

  public MobileNumberFormat(number: any, count) {
    let flag = true;

    if (number >= 48 && number <= 57) {
      if (count > 9) {
        flag = false;
      }
    } else {
      flag = false;
    }
    return flag;
  }

  /* -------------------------------- Enable side menu -----------------------------------*/

  DisableActiveLinkes() {
    let $li = $("#menu").find('li[name="item-header"]');
    if ($li !== null && $li.length > 0) {
      let index = 0;
      while (index < $li.length) {
        $($li[index]).removeClass("active");
        $($li[index])
          .find("a")
          .removeClass("active");
          
        $($li[index])
          .find('div[name="submenues"]')
          .removeAttr('style');

        $($li[index])
          .find('li[type="action"]')
          .removeClass("active active-list");
        index++;
      }
    }
  }

  public HighlightNavMenu(OptionalPageName: string = null) {
    let PageName = null;
    if (OptionalPageName !== null) {
      PageName = "/" + OptionalPageName;
      this.DisableActiveLinkes();
    } else {
      PageName = location.hash;
    }
    let elem = document.getElementById('sidebar').querySelector(`a[href="${PageName}"]`);
    if(elem != null) {
      let tag: any = elem.closest('li[name="item-header"]');
      tag.classList.add('active');
      tag.querySelector('a[class="action-name"]').classList.add("active");
      tag.querySelector('div[name="submenues"]').style.display = "block";
      elem.closest('li[type="action"]').classList.add('active', 'active-list');
    }
    
    // $('div[name="submenues"]').css({ display: "none" });
    // let $elem = $('a[name="' + PageName + '"][type="link"]');
    // if ($elem != null) {
    //   $elem.closest("li").addClass("active active-list");
    //   $elem.closest('li[name="item-header"]').addClass("active");

    //   $elem
    //     .closest('li[name="item-header"]')
    //     .children("a")
    //     .addClass("active");

    //   $elem.closest('div[name="submenues"]').css({ display: "block" });
    // }
  }

  /* -------------------------------- End side menu -----------------------------------*/

  ShowLoaderByAjax() {
    if (!this.LoaderEnableByAjax) {
      let $elem = $("#fadeloadscreen");
      if ($elem.length === 1) {
        $("#fadeloadscreen").removeClass("d-none");
        this.LoaderEnableByAjax = true;
      }
    }
  }

  HideLoaderByAjax() {
    if (this.LoaderEnableByAjax) {
      let $elem = $("#fadeloadscreen");
      if ($elem.length > 0) {
        $("#fadeloadscreen").addClass("d-none");
        this.LoaderEnableByAjax = false;
      }
    }
  }

  ShowLoader() {
    if (!this.LoaderEnableByAjax) {
      let $elem = $("#fadeloadscreen");
      if ($elem.length === 1) {
        $("#fadeloadscreen").removeClass("d-none");
      }
    }
  }

  HideLoader() {
    if (!this.LoaderEnableByAjax) {
      let $elem = $("#fadeloadscreen");
      if ($elem.length > 0) {
        $("#fadeloadscreen").addClass("d-none");
        this.LoaderEnableByAjax = false;
      }
    }
  }

  ShowToast(Message: string, TimeSpan: number = 5) {
    let $Toast = document.getElementById("toast");
    if ($Toast !== null && $Toast !== undefined) {
      $("#toastmessage").text(Message);
      $Toast.classList.add("show-tag");
      setTimeout(() => {
        this.HideToast();
      }, TimeSpan * 998);
    }
  }

  HideToast() {
    let $Toast = document.getElementById("toast");
    if ($Toast !== null && $Toast !== undefined) {
      $Toast.classList.remove("show-tag");
    }
  }

  GerPagination(TotalRecords: any, PageIndex: any, PageSize: any): any {
    // PageIndex always be start from 1 and not 0
    let Indexer = [];
    if (
      TotalRecords !== "" &&
      TotalRecords !== null &&
      PageIndex !== "" &&
      PageIndex !== null &&
      PageSize !== "" &&
      PageSize !== null
    ) {
      let $TotalRecord = parseInt(TotalRecords);
      let $CurrentIndex = parseInt(PageIndex) + 1;
      let TotalSlice = $TotalRecord / parseInt(PageSize);
      TotalSlice = Math.floor(TotalSlice);
      let Reminder = $TotalRecord % parseInt(PageSize);
      if (Reminder > 0) {
        TotalSlice++;
        let ExtraCounter = Math.floor($CurrentIndex / 5);
        let index = 0;
        while (index < TotalSlice) {
          Indexer.push(index + 1 + ExtraCounter * 5);
          index++;
          if (index == 5) break;
        }
      }
    }
    return Indexer;
  }

  /* -------------------- Auto dropdown actions -------------------------*/

  public ReadAutoCompleteValue($AutofillObject): any {
    let Data = null;
    if ($AutofillObject !== null) {
      if ($AutofillObject.find('input[name="iautofill-textfield"]') !== null) {
        Data = $AutofillObject.find('input[name="iautofill-textfield"]').val();
      }
    }
    return Data;
  }

  public ResetDropdown($Current: any) {
    $Current.find('input[name="iautofill-textfield"]').val("");
    $Current.find('input[name="iautofill-textfield"]').attr("data", "");
    $Current.find('input[name="iautofill-textfield"]').val("");
    $Current.find('input[name="autocomplete"]').val("");
  }

  public ReadAutoCompleteObject($AutofillObject): any {
    let Data = null;
    if ($AutofillObject !== null) {
      if ($AutofillObject.find('input[name="iautofill-textfield"]') !== null) {
        let ParsedValue = {};
        let CurrentTypeData = $AutofillObject
          .find('input[name="iautofill-textfield"]')
          .attr("data");
        if (IsValidString(CurrentTypeData)) {
          ParsedValue["data"] = JSON.parse(CurrentTypeData);
          ParsedValue["value"] = $AutofillObject
            .find('input[name="iautofill-textfield"]')
            .val();
        }
        Data = ParsedValue;
      }
    }
    return Data;
  }

  public GetStates(): Array<string> {
    let states = Array<string>();
    let JsonData = localStorage.getItem("master");
    let Data = JSON.parse(JsonData);
    if(IsValidType(Data)) {
      let stateCityModel = Data["StatesAndCities"];
      if(IsValidType(stateCityModel)) {
        stateCityModel.map((item, index) =>{
          if(states.indexOf(item.stateName) == -1)
            states.push(item.stateName);
        });
      }
    }
    return states;
  }

  public GetCities(stateName: string): Array<string> {
    let cities = Array<string>();
    let JsonData = localStorage.getItem("master");
    let Data = JSON.parse(JsonData);
    if(IsValidType(Data)) {
      let stateCityModel = Data["StatesAndCities"];
      cities = stateCityModel.filter(x=>x.stateName === stateName);
    }
    return cities;
  }

  SufixNumber(SufixStr: any): string {
    if (!isNaN(Number(SufixStr))) {
      let SufixNumber = parseInt(SufixStr);
      if (SufixNumber === 11 || SufixNumber === 12) {
        return SufixNumber + "th";
      } else {
        switch (SufixNumber % 10) {
          case 1:
            return SufixNumber + "st";
          case 2:
            return SufixNumber + "nd";
          case 3:
            return SufixNumber + "rd";
          default:
            return SufixNumber + "th";
        }
      }
    }
  }

  //--------------------- Auto dropdown action ends ---------------------*/
  /*---------------------------------------------------------------------*/

  /* -----------------------  Map dynamic table information --------------------------- */

  LoadMappingInitialData() {
    this.PageDetail.push({
      Page: "",
      PostDeleteUrl: "",
      GetUrl: "",
      PostEditUrl: "",
      PrimaryId: ""
    });
  }

  GetPageActionDetail(PageName: string): MappedActionPage {
    let mappedActionPage: MappedActionPage = null;
    let CurrentPageDetail = this.PageDetail.filter(x => x.Page === PageName);
    if (CurrentPageDetail.length > 0) {
      mappedActionPage = CurrentPageDetail[0];
    }
    return mappedActionPage;
  }

  /* --------------------------------- end ------------------------------------------ */
}

export function IsValidType(Value): boolean {
  let Flag: boolean = false;
  if (Value !== null && Value !== undefined && Value !== "" && Value !== "{}") {
    let ValueDataType = typeof Value;
    if (ValueDataType !== "undefined") {
      if (ValueDataType === "string") {
        if (Value.trim().length > 0) {
          Flag = true;
        }
      } else if (ValueDataType === "object") {
        if (Array.isArray(Value)) {
          if (Value.length > 0) Flag = true;
        } else if (Value instanceof Date) {
          Flag = true;
        } else {
          if (Object.keys(Value).length > 0) Flag = true;
        }
      } else if (ValueDataType === "number") {
        return Value >= 0;
      }
    }
  }
  return Flag;
}

export function IsValidResponse(res: any) {
  let flag = false;
  if (IsValidType(res.body)) {
    let response: IResponse = res.body;
    if (response !== null) {
      if (response.HttpStatusCode === 200) flag = true;
    }
  }
  return flag;
}

export function IsSuccess(res: IResponse) {
  let flag = false;
    if (res.HttpStatusMessage === "success")
      flag = true;
  return flag;
}

export function IsValidBoolean(data: any): boolean {
  let type = typeof data;
  if (type === "boolean") return data;
  return false;
}

export function IsValidTime(TimeOption: any): string {
  if (TimeOption === undefined || TimeOption === null || TimeOption === "")
    return null;
  else {
    let keys = Object.keys(TimeOption);
    if (keys.indexOf("hour") !== -1 && keys.indexOf("minute") !== -1)
      return `${TimeOption["hour"]}:${TimeOption["minute"]}`;
    else return null;
  }
}

export function IsValidString(Data: any): boolean {
  if (Data === undefined || Data === null || Data === "") return false;
  else if (Data.trim() === "") return false;
  else return true;
}

export function FormateDate(PassedDate: string, Formate: string) {
  let FormatedDate: string = null;
  if (IsValidString(PassedDate)) {
    FormatedDate = new Date(PassedDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
  return FormatedDate;
}

export function GroupBy(ItemList: Array<any>, Key: any) {
  return ItemList.reduce(function (rv, x) {
    (rv[x[Key]] = rv[x[Key]] || []).push(x);
    return rv;
  }, {});
}

export function UniqueItem(Items: Array<any>, Key: any): Array<any> {
  let index = 0;
  let i = 0;
  let UniqueItems = [];
  if (IsValidType(Items)) {
    while (index < Items.length) {
      i = UniqueItems.findIndex((x) => x[Key] === Items[index][Key]);
      if (i === -1) {
        UniqueItems.push(Items[index]);
      }
      index++;
    }
  }
  return UniqueItems;
}

export function GetReportData(data: any, searchQuery: any): any {
  let GridData: any = null;
  try{
    let Keys = Object.keys(data);
    if (Keys.indexOf(Total) !== -1 && Keys.indexOf(Rows) !== -1 && Keys.indexOf(Columns) !== -1){
      let TotalCount = data[Total][ZerothIndex].Total;
      GridData = {
        headers: data[Columns],
        rows: data[Rows],
        totalCount: TotalCount,
        pageIndex: searchQuery.PageIndex,
        pageSize: searchQuery.PageSize,
        url: "",
      };
    }
  } catch(e) {
    console.log('Error on trying to parse server returned data.');
  }
  return GridData;
}

export function BuildGrid(response: any, searchQuery: any): any {
  let GridData = null;
  if (IsValidType(response.ResponseBody)) {
    let Data = JSON.parse(response.ResponseBody);
    let gridData = GetReportData(Data, searchQuery);
    if(gridData != null) {
      GridData = gridData;
    } else {
      this.commonService.ShowToast(
        "Receive invalid data. Please contact to admin."
      );
    }
  } else {
    this.commonService.ShowToast(
      "Server error. Please contact to admin."
    );
  }
  return GridData;
}

export function ActualOrDefault(data: any, modal: any): any {
  if (
    data !== undefined &&
    data !== null &&
    modal !== undefined &&
    modal !== null
  ) {
    let keys = Object.keys(modal);
    let type = null;
    let value = null;
    let key = null;
    let valueType = null;
    let index = 0;
    while (index < keys.length) {
      key = keys[index];
      type = typeof modal[key];
      value = data[key];
      valueType = typeof data[key];
      switch (type) {
        case "string":
          if (valueType === "undefined" || value === null) data[key] = "";
          break;
        case "object":
          if (data[key] instanceof Array) {
            if (valueType === "undefined" || value === null) data[key] = [];
          } else {
            if (valueType === "undefined" || value === null) data[key] = {};
          }
          break;
        case "number":
          if (valueType === "undefined" || value === null) data[key] = 0;
          break;
        case "boolean":
          if (valueType === "undefined" || value === null) {
            if (valueType === "number") {
              if (value === 1) data[key] = true;
              else data[key] = false;
            } else {
              data[key] = false;
            }
          }
          break;
      }
      index++;
    }
  }
  return data;
}

export interface IResponse {
  ResponseBody: string;
  HttpStatusCode: number;
  HttpStatusMessage: string;
  AuthenticationToken: string;
}
