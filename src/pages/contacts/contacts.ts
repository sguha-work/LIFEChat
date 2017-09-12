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
    this.model.LIFEContactList = [];
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

  private distinguishLIFEContacts() {
    let promiseArray = [];
    for(let index=0; index<this.model.contactList.length; index++) {
      let promise = new Promise((resolve, reject) => {
        this.contacts.isALIFEMember(this.model.contactList[index].phoneNumber).then((value) => {
          if(value === false) {
            resolve();
          } else {
            this.model.contactList[index].lifeObject = value;
            this.model.contactList[index].isOnLIFEChat = true;
            this.model.LIFEContactList.push(this.model.contactList[index]);
            this.model.contactList.slice(index, 1);
          }
        }).catch(()=> {
          resolve();
        });
      });
      promiseArray.push(promise);
    }
    Promise.all(promiseArray).then(() => {}).catch(() => {});
  }

  private loadContactDetails() {
    this.contacts.getContactList().then((contactList) => {
      this.model.contactList = contactList;
      contactList = null;
      this.distinguishLIFEContacts();
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
    $("page-contacts .sideBar").css({"height":"210px"});
  }
}
