import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {AlertService} from "./../../services/alert.service";
import {ContactService} from "./../../services/contact.service";
import {CommonService} from "./../../services/common.service";
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html'
})
export class ContactsPage {
  public model: any;
  constructor(public navCtrl: NavController, private alertService: AlertService, private contactService: ContactService, private commonService: CommonService) {
    this.model = {};
    this.model.contacts = [];
    this.commonService.getPresentUserData().then((userData) => {
      this.model.userData = userData;
      this.model.userData.image = "";
      this.populateContacts(userData.phoneNumber);
    }).catch(() => {
      // unable to fetch userdata
    });
  }

  private populateContacts(phoneNumber: string) {
    this.contactService.getPhoneContacts(phoneNumber).then((value) => {
      this.model.contacts = value;
    }).catch(() => {
      // unable to get phone contacts
      
    });
  }

  refreshPhoneContact() {
    this.contactService.refreshPhoneContactList(this.model.userData.phoneNumber).then((value) => {
      this.model.contacts = value;
    }).catch(() => {
      // unable to get phone contacts
    });
  }
  shareLIFELink(phoneNumber: string, name: string) {
    this.contactService.shareLIFEChat(phoneNumber, name);
  }
}
