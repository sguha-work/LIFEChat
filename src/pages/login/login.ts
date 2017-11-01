import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { JoinLIFEPage } from '../join-life/join-life';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController) {
  }

  public goToSignUpPage() {
    this.navCtrl.push(JoinLIFEPage);
  }
  
}
