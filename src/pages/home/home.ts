import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as $ from 'jquery';

import {ContactService} from "./../../services/contact.service";
import {AlertService} from "./../../services/alert.service";
import {CommonService} from "./../../services/common.service";

import {ConversationPage} from "./../conversation/conversation";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public model: any;
  constructor(public navCtrl: NavController, private contactService: ContactService, private alertService: AlertService, public common: CommonService) {
    this.model = {};
    this.model.lifeContacts = [];
    this.populateLIFEContacts();
  }

  private startSpinner() {
    $("#refresh").addClass("fa-spin").css({
      "pointer-events": "none",
      "opacity": "0.5"
    });
  }

  private stopSpinner() {
    $("#refresh").removeClass("fa-spin").removeAttr("style");
  }
  private populateLIFEContacts() {
    this.startSpinner();
    let user = JSON.parse(localStorage["user"]);
    this.contactService.getLIFEContacts(user.phoneNumber).then((contactList)=>{
      this.model.lifeContacts = contactList;
      this.stopSpinner();
    }).catch((message)=> {
      this.alertService.showAlert(message);
      this.stopSpinner();
    });
  }
  
  public refreshLIFEContacts() {
    let user = JSON.parse(localStorage["user"]);
    this.startSpinner();
    this.contactService.refreshLIFEContactList(user.phoneNumber).then((data) => {
      this.model.lifeContacts = data;
      this.stopSpinner();
    }).catch(() => {
      this.stopSpinner();
    });
  }

  public startConversation(phoneNumber: string) {
    this.contactService.getLIFEContactFromPhoneNumber(phoneNumber).then((contactObject) => {
      sessionStorage["chatWith"] = JSON.stringify(contactObject);
      this.navCtrl.push(ConversationPage);
    }).catch(() => {
      alert("error");
    });
  }
}
