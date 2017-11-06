import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {CommonService} from "./../../services/common.service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private common: CommonService) {
    alert("x");
  }


  
}
