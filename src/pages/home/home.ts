import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {TabsControllerPage} from '../tabs-controller/tabs-controller';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {
  }
  
}
