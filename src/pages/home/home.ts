import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as $ from 'jquery';

import {AlertService} from "./../../services/alert.service";
import {ContactService} from "./../../services/contact.service";
import {CommonService} from "./../../services/common.service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private model: any;

  constructor(public navCtrl: NavController, private alertService: AlertService, private contactService: ContactService, private commonService: CommonService) {
    this.model = {};
    this.model.lifeContacts = [];
    this.commonService.getPresentUserData().then((userData) => {
      this.model.userData = userData;
      this.model.userData.image = "";
      this.populateLIFEContacts(userData.phoneNumber);
    }).catch(() => {
      // unable to fetch userdata
    });
    
  }
  private modifyLIFEContacts(lifeContacts: any): Promise<any> {
    return new Promise((resolve, reject) => {
      for(let index=0; index<lifeContacts.length; index++) {
        lifeContacts[index].lastSeen = this.commonService.getTimeFromTimeStamp(lifeContacts[index].lastSeen);
      }
      resolve(lifeContacts);
    });
  }
  private populateLIFEContacts(phoneNumber: string) {
    this.contactService.getLIFEContacts(phoneNumber).then((value) => {
      this.modifyLIFEContacts(value).then((value) => {
        this.model.lifeContacts = value;
      }).catch(() => {
        alert("failed");
      });
    }).catch(() => {
      alert("failed")
    });
  }

  private disableRefreshButton() {
    $("page-home #loader").addClass("fa-spin").css({
      "pointer-events": "none",
      "opacity": "0.7"
    });
  }
  private enableRefreshButton() {
    $("page-home #loader").removeClass("fa-spin").css({
      "pointer-events": "all",
      "opacity": "1"
    });
  }

  refreshLIFEContact() {
    this.disableRefreshButton();
    this.contactService.refreshLIFEContacts(this.model.userData.phoneNumber).then(()=>{
      this.enableRefreshButton();
    }).catch(() => {
      this.enableRefreshButton();
    });
  }
  
}
