import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as $ from 'jquery';

import {ContactService} from "./../../services/contact.service";
import {AlertService} from "./../../services/alert.service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private contactService: ContactService, private alertService: AlertService) {
    
    this.populateLIFEContacts();
  }

  private populateLIFEContacts() {
    let user = JSON.parse(localStorage["user"]);
    this.contactService.getLIFEContacts(user.phoneNumber).then((contactList)=>{
      alert(JSON.stringify(contactList));
    }).catch((message)=> {
      this.alertService.showAlert(message);
    });
  }
  
}
