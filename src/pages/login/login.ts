import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { JoinLIFEPage } from '../join-life/join-life';

import {CommonService} from "./../../services/common.service";
import {LoginService} from "./../../services/login.service";
import {AlertService} from "./../../services/alert.service";
import {User} from "./../../interfaces/user.interface";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage  implements AfterViewInit {

  private phoneNUmberDOM: any;
  private passwordDOM: any;

  constructor(public navCtrl: NavController,  private common: CommonService, private login: LoginService, private alertService: AlertService) {
  }

  gotoSignUp() {
    this.navCtrl.push(JoinLIFEPage);
  }

  beginLoginProcess() {

  }

  ngAfterViewInit() {
    this.phoneNUmberDOM = $("page-login #txt_phoneNumber input");
    this.passwordDOM = $("page-login #txt_password input");
  }
}
