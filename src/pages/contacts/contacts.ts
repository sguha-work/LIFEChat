import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as $ from 'jquery';

import {ContactService} from "./../../services/contact.service";
import {AlertService} from "./../../services/alert.service";
import {CommonService} from "./../../services/common.service";

@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html'
})
export class ContactsPage {

  public model: any;
  constructor(public navCtrl: NavController, private contactService: ContactService, private alertService: AlertService, public common: CommonService) {
    this.model = {};
    this.model.contacts = [];
    this.populatePhoneContacts();
  }

  private startSpinner() {
    $("page-contacts .icon-refresh").addClass("fa-spin").css({
      "pointer-events": "none",
      "opacity": "0.5"
    });
  }

  private stopSpinner() {
    $("page-contacts .icon-refresh").removeClass("fa-spin").removeAttr("style");
  }
  private populatePhoneContacts() {
    this.startSpinner();
    let user = JSON.parse(localStorage["user"]);
    this.contactService.getPhoneContacts(user.phoneNumber).then((contactList)=>{
      this.model.contacts = contactList;
      this.stopSpinner();
    }).catch((message)=> {
      this.alertService.showAlert(message);
      this.stopSpinner();
    });
  }
  
  public refreshContacts() {
    let user = JSON.parse(localStorage["user"]);
    this.startSpinner();
    this.contactService.refreshPhoneContactList(user.phoneNumber).then((data) => {
      this.model.contacts = data;
      this.stopSpinner();
    }).catch(() => {
      this.stopSpinner();
    });
  }
  
}
