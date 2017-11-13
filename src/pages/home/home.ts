import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {CommonService} from "./../../services/common.service";
import {User} from "./../../interfaces/user.interface";
import {ContactService} from "./../../services/contact.service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public model: any;

  constructor(public navCtrl: NavController, private common: CommonService, private contactService: ContactService) {
    this.model = {};
    this.model.LIFEContacts = [];
    this.loadLIFEContacts(localStorage["user"]);
  }

  private loadLIFEContacts(userObject: User) {
    //this.model.LIFEContacts
  }

  
}
