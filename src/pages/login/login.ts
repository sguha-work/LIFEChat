import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AfterViewInit } from '@angular/core';
import { Platform } from 'ionic-angular';
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

  private phoneNumberDOM: any;
  private passwordDOM: any;
  private loginButtonDOM: any;

  constructor(public navCtrl: NavController,  private common: CommonService, private login: LoginService, private alertService: AlertService, private platform: Platform) {
  }

  private validate() {
    let phoneNUmber = this.phoneNumberDOM.val().toString().trim();
    if(!this.common.validatePhoneNumber(phoneNUmber)) {
      this.phoneNumberDOM.css({
        "border-bottom": "1px solid red"
      });
      return false;
    } else {
      this.phoneNumberDOM.css({
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

  private disableLoginButton() {
    this.loginButtonDOM.css({
      "opacity": "0.5",
      "pointer-events": "none"
    });
  }
  
  private enableLoginButton() {
    this.loginButtonDOM.css({
      "opacity": "1",
      "pointer-events": "all"
    });
  }

  gotoSignUp() {
    this.navCtrl.push(JoinLIFEPage);
  }

  beginLoginProcess() {
    if(this.validate()) {
      this.disableLoginButton();
      let phoneNumber = this.phoneNumberDOM.val().toString().trim();
      let password = this.passwordDOM.val().toString().trim();
      this.login.loginUser(phoneNumber).then((userData) => {
        if( userData===null ) {
          this.alertService.showAlert("This phonenumber is not registered. Please sign up first", "Login Failed");    
          this.enableLoginButton();
        } else {
          if(userData.password !== password) {
            this.alertService.showAlert("Password missmatch", "Login Failed");                
            this.enableLoginButton();
          } else {
            this.common.getDeviceID().then((value) => {
              let user: any;
              user = userData;
              user.lastLogIn = Date.now();
              user.lastSeen = Date.now();
              user.loggedInDeviceId = value;

              this.login.updateUserStatus(phoneNumber, user).then(() => {
                //if(this.platform.is("cordova")) {
                    this.login.createLocalLoginEntry(user);
                //}
                this.navCtrl.push(TabsControllerPage);
              }).catch(() => {
                this.alertService.showAlert("Unable to connect to database", "Connection problem");
                this.enableLoginButton();
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
    this.phoneNumberDOM = $("page-login #txt_phoneNumber input");
    this.passwordDOM = $("page-login #txt_password input");
    this.loginButtonDOM = $("page-login #button_login");
  }
}
