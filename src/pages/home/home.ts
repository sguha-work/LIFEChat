import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as $ from 'jquery';

import {ContactService} from "./../../services/contact.service";
import {AlertService} from "./../../services/alert.service";
import {CommonService} from "./../../services/common.service";

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

  private populateLIFEContacts() {
    let user = JSON.parse(localStorage["user"]);
    this.contactService.getLIFEContacts(user.phoneNumber).then((contactList)=>{
      this.model.lifeContacts = contactList;
    }).catch((message)=> {
      this.alertService.showAlert(message);
    });
  }
  
  public refreshLIFEContacts() {
    let user = JSON.parse(localStorage["user"]);
    $("#refresh").addClass("fa-spin").css({
      "pointer-events": "none",
      "opacity": "0.5"
    });
    this.contactService.refreshLIFEContactList(user.phoneNumber).then((data) => {
      this.model.lifeContacts = data;
      $("#refresh").removeClass("fa-spin").removeAttr("style");
    }).catch(() => {
      $("#refresh").removeClass("fa-spin").removeAttr("style");
    });
  }
}
