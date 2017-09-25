import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { JoinLIFEPage } from '../join-life/join-life';
import { TabsControllerPage } from './../tabs-controller/tabs-controller';

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

  private validate() {
    let phoneNUmber = this.phoneNUmberDOM.val().toString().trim();
    if(!this.common.validatePhoneNumber(phoneNUmber)) {
      this.phoneNUmberDOM.css({
        "border-bottom": "1px solid red"
      });
      return false;
    } else {
      this.phoneNUmberDOM.css({
        "border-bottom": "1px solid transparent"
      });
    }

    let password = this.passwordDOM.val().toString().trim();
    if(!this.common.validatePassword(password)) {
      this.passwordDOM.css({
        "border-bottom": "1px solid red"
      });
      return false;
    } else {
      this.passwordDOM.css({
        "border-bottom": "1px solid transparent"
      });
    }
    return true;
  }

  gotoSignUp() {
    this.navCtrl.push(JoinLIFEPage);
  }

  beginLoginProcess() {
    if(this.validate()) {
      let phoneNUmber = this.phoneNUmberDOM.val().toString().trim();
      let password = this.passwordDOM.val().toString().trim();
      this.login.loginUser(phoneNUmber).then((value) => {
        if( value===null ) {
          this.alertService.showAlert("This phonenumber is not registered. Please sign up first", "Login Failed");    
        } else {
          if(value.password !== password) {
            this.alertService.showAlert("Password missmatch", "Login Failed");                
          } else {
            this.common.getDeviceID().then((value) => {
              let user: any;
              user = {};
              user.lastLogIn = Date.now();
              user.lastSeen = Date.now();
              user.loggedInDeviceId = value;

              this.login.updateUserStatus(phoneNUmber, user).then(() => {
                this.navCtrl.push(TabsControllerPage);
              }).catch(() => {
                this.alertService.showAlert("Unable to connect to database", "Connection problem");
              });
              
            }).catch(() => {
              this.alertService.showAlert("Error fetching device id, user cannot be registerred. Make sure to give call/phone access.", "Error");
            });
            
          }
        }
      }).catch(() => {
        this.alertService.showAlert("Unable to connect to database", "Connection problem");
      });
    }
  }

  ngAfterViewInit() {
    this.phoneNUmberDOM = $("page-login #txt_phoneNumber input");
    this.passwordDOM = $("page-login #txt_password input");
  }
}
