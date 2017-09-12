import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AfterViewInit } from '@angular/core';
import { Events } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
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
  public gettingLIFEContactLoader: boolean;
  public gettingContactLoader: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private common: CommonService, private events: Events, private contacts: ContactService,  private socialSharing: SocialSharing) {
    this.model = {};
    this.model.contactList = [];
    this.model.LIFEContactList = [];
    this.gettingLIFEContactLoader = true;
    this.gettingContactLoader = true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactsPage');
  }

  clickAction(phoneNumber: string,name: string, isInLife: boolean) {
    if(isInLife) {
      this.common.showPage("page-conversation");
    } else {
      this.shareLIFEChat(phoneNumber, name);
    }
    
  }

  private shareLIFEChat(phoneNumber: string, name: string) {
    if(confirm("Want to share LIFEChat to "+name+"?")) {
      this.socialSharing.share("You are invited to LIFEChat, a new fresh simple chat application", null, null, "https://drive.google.com/open?id=0B7H8-Q6hAIvNdFNmZUxYSlRGZTA"); 
    }
  }

  private distinguishLIFEContacts() {
    let promiseArray = [];
    for(let index=0; index<this.model.contactList.length; index++) {
      let promise = new Promise((resolve, reject) => {
        this.gettingLIFEContactLoader = true;
        this.contacts.isALIFEMember(this.model.contactList[index].phoneNumber).then((value) => {
          if(value === false) {
            this.gettingLIFEContactLoader = false;
            resolve();
          } else {
            this.gettingLIFEContactLoader = false;
            this.model.contactList[index].lifeObject = value;
            this.model.contactList[index].isOnLIFEChat = true;
            this.model.LIFEContactList.push(this.model.contactList[index]);
            this.model.contactList.slice(index, 1);
          }
        }).catch(()=> {
          this.gettingLIFEContactLoader = false;
          resolve();
        });
      });
      promiseArray.push(promise);
    }
    Promise.all(promiseArray).then(() => {
      //this.gettingLIFEContactLoader = false;
      if(this.model.LIFEContactList.length === 0) {
        $("#div_noLifeContacts").show();
      } else {
        $("#div_noLifeContacts").hide();
      }
    }).catch(() => {
      //this.gettingLIFEContactLoader = false;
      $("#div_noLifeContacts").show();
    });
  }

  private loadContactDetails() {
    this.gettingContactLoader = true;
    this.gettingLIFEContactLoader = true;
    this.contacts.getContactList().then((contactList) => {
      this.model.contactList = contactList;
      contactList = null;
      this.gettingContactLoader = false;
      if(this.model.contactList.length) {
        $("#div_noContacts").hide();
        this.distinguishLIFEContacts();
      } else {
        $("#div_noContacts").show();
        $("#div_noLifeContacts").show();
        this.model.LIFEContactList = [];
        this.gettingLIFEContactLoader = false;
      }
      
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
