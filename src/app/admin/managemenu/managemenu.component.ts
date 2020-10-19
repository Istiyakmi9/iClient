import { Component, OnInit } from '@angular/core';
import { ApplicationStorage } from 'src/providers/ApplicationStorage';
import { ZerothIndex } from 'src/providers/constants';
import { Dictionary } from 'src/providers/Generic/Code/Dictionary';
import * as $ from 'jquery';
import { AjaxService } from 'src/providers/ajax.service';
import { CommonService, IsValidType } from 'src/providers/common-service/common.service';

@Component({
  selector: 'app-managemenu',
  templateUrl: './managemenu.component.html',
  styleUrls: ['./managemenu.component.scss']
})
export class ManagemenuComponent implements OnInit {
  category: Array<any>;
  subCategories: Dictionary<string, any>;
  subCatagoryItems: any;
  bindingItems: any;
  dropdownCatagories: any;
  dropdownSubCatagories: any;
  element: any;
  categoryIndex: number = 0;
  targetSubCatagory: string = "";
  targetCatagory: string = "";
  currentTargetElement: string = "";
  currentTargetCategory: string = "";

  constructor(private storage: ApplicationStorage, private http: AjaxService, private common: CommonService) { }

  ngOnInit(): void {
    var menu = this.storage.get(null, 'Menu');
    this.BildPageData(menu);
    this.element = $('#menu-dv');
  }

  BildPageData(menuData: any) {
    this.category = menuData.filter(x=>x.Childs === null);
    if(this.category.length > 0) {
      this.subCategories = new Dictionary<string, any>();
      let menuItems = null;
      this.category.map((sub, i) => {
        let items = menuData.filter(x=>x.Childs == sub.Catagory);
        if(items.length > 0) {
          menuItems = new Dictionary<string, any>();
          let index = 0;
          while(index < items.length) {
            menuItems.insert(items[index].Catagory, menuData.filter(x=>x.Childs == items[index].Catagory));
            index++;
          }
        }
        this.subCategories.insert(sub.Catagory, menuItems["mapTable"]);
      });

      this.subCatagoryItems = this.subCategories['mapTable'];
      this.dropdownCatagories = this.subCatagoryItems;
      if(this.subCatagoryItems.length > 0) {
        this.bindingItems = this.subCatagoryItems[this.categoryIndex].value;
      }
    }
  }

  SelectSection(index: any) {
    if(index <= this.subCatagoryItems.length) {
      this.categoryIndex = index;
      this.bindingItems = this.subCatagoryItems[this.categoryIndex].value;
    }
  }

  ChangedSection(elem: any) {
    let val = elem.currentTarget.value;
    let currentCategory = this.subCatagoryItems.filter(x => x.key === val);
    if(currentCategory.length > 0) {
      this.dropdownSubCatagories = currentCategory[ZerothIndex].value;
    }
  }

  getActionPopover(elem: any, currentItem: string, currentCategory: string) {
    this.currentTargetElement = currentItem;
    this.currentTargetCategory = currentCategory;
    this.targetCatagory = "";
    this.targetSubCatagory = "";
    let xAxisWidth = elem.x;
    let winWidth = window.innerWidth;
    let boxWidth = this.element.width();
    let boxHeight = this.element.height();
    let left = elem.pageX;
    var top = elem.pageY;

    if(winWidth - xAxisWidth > 300) {
      this.element.css({'left': left + 20, 'top': top - boxHeight * .4});
    } else {
      this.element.css({'left': (left - (boxWidth + 20)), 'top': top - boxHeight * .4});
    }
    this.element.removeClass('d-none');
  }

  closePopover() {
    this.element.addClass('d-none');
  }

  moveToAnotherSection() {
    if(this.targetCatagory !== "" && this.targetSubCatagory !== "" && this.currentTargetElement !== null) {
      let requestObject = {
        OldCatagory: this.currentTargetCategory,
        Category: this.targetSubCatagory,
        MenuName: this.currentTargetElement,
      };

      this.http.post("AdminMaster/MoveMenu", requestObject).then(response => {
          if (this.common.IsValidResponse(response)) {
            this.common.ShowToast('Menu updated successfully.');
          } else {
            this.common.ShowToast('Unable to update. Please contact to admin.');
          }
      }).catch(err => {
        this.common.ShowToast('Received server error. Please contact admin.');
      });      
    }
  }
}
