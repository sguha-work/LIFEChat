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

  constructor(public navCtrl: NavController, public navParams: NavParams, private common: CommonService, private events: Events, private contacts: ContactService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactsPage');
  }

  openConversation() {
    this.common.showPage("page-conversation");
  }

  private loadContactDetails() {
    this.contacts.getContactList().then(() => {}).catch(() => {
      
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
