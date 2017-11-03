import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

import { JoinLIFEPage } from '../join-life/join-life';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController, private menu: MenuController) {
    this.menu.swipeEnable(false);
  }

  public goToSignUpPage() {
    this.navCtrl.push(JoinLIFEPage);
  }
  
}
