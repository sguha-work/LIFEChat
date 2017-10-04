import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as $ from 'jquery';

import {ConversationPage} from './../conversation/conversation';

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

  private loadImages() {
    let imageObjectLength = $("page-home img[data-image-file-name]").length;
    let promiseArray = [];
    for(let index=0; index<imageObjectLength; index++) {
      let promise = new Promise((res, rej) => {
        let imageFileName = $("page-home img[data-image-file-name]").eq(index).next().val();
        $("page-home img[data-image-file-name]").eq(index).next().remove();
        if(imageFileName === "" || imageFileName === null) {
          $("page-home img[data-image-file-name]").eq(index).attr("src", "assets/img/no-photo_40x40.png");
          res();
        } else {
          this.contactService.getImageDataFromFileName(imageFileName).then((value) => {
            $("page-home img[data-image-file-name]").eq(index).attr("src", value);
            res();
          }).catch(() => {
            res();
          });
        }
        
      });
      promiseArray.push(promise);
    }
    Promise.all(promiseArray).then(() => {
      //alert("pass");
    }).catch(() => {
      //alert("fail fail")
    });
  }
  private populateLIFEContacts(phoneNumber: string) {
    this.contactService.getLIFEContacts(phoneNumber).then((value) => {
      this.modifyLIFEContacts(value).then((value) => {
        this.model.lifeContacts = value;
        setTimeout(() => {
          this.loadImages();
        }, 2000);
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

  openProfile(phoneNumber: string) {
    alert(phoneNumber);
  }

  openConversation(phoneNumber: string) {
    this.contactService.getLIFEContactDetails(phoneNumber).then((contactData) => {
      sessionStorage["currentActiveUser"] = JSON.stringify(contactData);
      this.navCtrl.push(ConversationPage);
    }).catch(() => {
      // nothing to do
    });
    
  }
  
}
