import { Component, OnInit } from "@angular/core";
import { AjaxService } from "src/providers/ajax.service";
import { CommonService, IsValidType } from "src/providers/common-service/common.service";
import { ApplicationStorage } from "src/providers/ApplicationStorage";
import { WorkBook, read, utils, write, readFile } from "xlsx";
import { saveAs } from "file-saver";
import * as $ from "jquery";
import { Dictionary } from "src/providers/Generic/Code/Dictionary";
import { ZerothIndex } from 'src/providers/constants';
import { IColumns } from 'src/providers/Generic/Interface/IColumns';
import { ITable } from 'src/providers/Generic/Interface/ITable';

@Component({
  selector: 'app-uploadresult',
  templateUrl: './uploadresult.component.html',
  styleUrls: ['./uploadresult.component.scss']
})
export class UploadresultComponent implements OnInit {
  wbout = [];
  table = [];
  file: File;
  mappedColumn: Array<IColumns>;
  fileSize: string;
  fileName: string;
  isFileReady: boolean = false;
  noOfRecords: number;
  recordToUpload: any;
  ws: any;
  IsResultGenerated: boolean = false;
  ScriptFileName: string = "";
  DynamicTableResult: Array<any>;
  ExcelTableHeader: Array<any>;
  ExcelTableData: Array<any>;
  GridData: ITable;
  pageIndex: number = 1;
  pageSize: number = 15;

  constructor(
    private http: AjaxService,
    private common: CommonService,
    private storage: ApplicationStorage
  ) {}

  s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  }
  ngOnInit() {
    this.ExcelTableHeader = [];
    this.ExcelTableData = [];
  }

  fireBrowserFile() {
    $("#uploadexcel").click();
  }

  SaveToExcel(tableData, fileName: string = "QuestionSheet") {
    this.setTableData(tableData, fileName);
    saveAs(
      new Blob([this.s2ab(this.wbout)], { type: "application/octet-stream" }),
      fileName + ".xlsx"
    );
  }

  getTableData() {
    return this.table;
  }

  setTableData(tableData, fileName: string) {
    this.table = tableData;
    this.setExcelProperties(fileName);
  }

  setExcelProperties(fileName: string) {
    const ws_name = fileName.substr(0, 25); //'QuestionSheet'
    //  const ws_name = ''; // worksheet name cannot exceed 31 chracters length
    const wb: WorkBook = { SheetNames: [], Sheets: {} };
    this.ws = utils.json_to_sheet(this.getTableData());
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = this.ws;
    this.wbout = write(wb, { bookType: "xlsx", bookSST: true, type: "binary" });
  }

  readExcelData(e: any) {
    this.file = e.target.files[0];
    if (this.file !== undefined && this.file !== null) {
      this.convertToJson(false).then(data => {
        if (this.common.IsValid(data)) {
          this.recordToUpload = data;
          this.fileSize = (this.file.size / 1024).toFixed(2);
          this.fileName = this.file.name;
          this.noOfRecords = this.recordToUpload.length;
          this.isFileReady = true;
          let excelData = data.mapTable[ZerothIndex];
          if(IsValidType(excelData)) {
            this.ExcelTableHeader = excelData.value.Keys;
            this.mappedColumn = [];
            excelData.value.Keys.map((item, index) => {
              this.mappedColumn.push({ 
                column: item.ColumnName, 
                header: item.ColumnName 
              });
            });
            this.ExcelTableData = excelData.value.Data;
            this.GridData = {
              headers: this.mappedColumn,
              rows: this.ExcelTableData.slice(0, 15),
              totalCount: this.ExcelTableData.length,
              pageIndex: this.pageIndex,
              pageSize: this.pageSize,
              inlineContent: true
            };
          }
        } else {
          this.cleanFileHandler();
          this.common.ShowToast("Excel data is not valid.");
        }
      });
    }
  }

  cleanFileHandler() {
    $("#uploadexcel").val("");
    this.fileSize = "";
    this.fileName = "";
    this.isFileReady = false;
    this.noOfRecords = 0;
    event.stopPropagation();
    event.preventDefault();
  }

  convertToJson(onlyHeader: boolean = true): Promise<any> {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      let workbookkk;
      let XL_row_object;
      let TempDictionary = new Dictionary<string, any>();
      reader.readAsBinaryString(this.file);
      reader.onload = function() {
        let data = reader.result;
        workbookkk = read(data, { type: "binary" });
        workbookkk.SheetNames.forEach(function(sheetName) {
          XL_row_object = utils.sheet_to_json(workbookkk.Sheets[sheetName]);
          let position = TempDictionary.hasKey(sheetName);
          if (
            position === -1 &&
            XL_row_object !== null &&
            XL_row_object.length > 0
          ) {
            let RowDetail = XL_row_object[0];
            let ColumnDetail = [];
            if (RowDetail !== null) {
              if (typeof RowDetail === "object") {
                let Keys = Object.keys(RowDetail);
                let index = 0;
                let Type = "";
                while (index < Keys.length) {
                  Type = typeof RowDetail[Keys[index]];
                  if (
                    Type === "undefined" ||
                    RowDetail[Keys[index]] === null ||
                    RowDetail[Keys[index]] == ""
                  ) {
                    Type = "string";
                  }
                  ColumnDetail.push({
                    ColumnName: Keys[index],
                    ColumnType: Type
                  });
                  index++;
                }
              }
            }
            let SheetData = {
              Keys: ColumnDetail,
              Data: onlyHeader ? null : XL_row_object
            };
            TempDictionary.insert(sheetName, SheetData);
          }
          resolve(TempDictionary);
        });
      };
    });
  }

  uploadExcelSheet() {

  }

  OnEdit(data: any) {}
  
  OnDelete(data: any) {}

  NextPage(data: any) {
    let recordDetail = JSON.parse(data);
    if(IsValidType(recordDetail)){
      this.pageIndex = recordDetail.PageIndex;
    }
    this.GridData = {
      headers: this.mappedColumn,
      rows: this.ExcelTableData.slice((this.pageIndex - 1) * 15, ((this.pageIndex - 1) * this.pageSize + 15)),
      totalCount: this.ExcelTableData.length,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      inlineContent: true
    };
  }

  PreviousPage(data: any) {}
}