import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {AlertService} from "./../../services/alert.service";
import {ContactService} from "./../../services/contact.service";
import {CommonService} from "./../../services/common.service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private alertService: AlertService, private contactService: ContactService, private commonService: CommonService) {
  }
  
}
