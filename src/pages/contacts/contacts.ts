import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AfterViewInit } from '@angular/core';
import { Events } from 'ionic-angular';
import * as $ from 'jquery';

import {CommonService} from "./../../services/common.service";
import {ContactService} from "./../../services/contact.service";
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage   implements AfterViewInit {
  public model: any;
  public contactList;
  constructor(public navCtrl: NavController, public navParams: NavParams, private common: CommonService, private events: Events, private contacts: ContactService) {
    this.model = {};
    this.model.contactList = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactsPage');
  }

  clickAction(phoneNumber: string,name: string, isInLife: boolean) {alert(name);
    if(isInLife) {
      this.common.showPage("page-conversation");
    } else {
      alert("Want to invite "+phoneNumber);
    }
    
  }

  private loadContactDetails() {
    this.contacts.getContactList().then((contactList) => {
      this.model.contactList = contactList;
      contactList = null;
    }).catch(() => {

    });
  }

  private bindEvents() {
    this.events.subscribe("LOAD-CONTACTS", () => {
      this.loadContactDetails();
    });
    
  }

  ngAfterViewInit() {
    this.bindEvents();
  }
}
