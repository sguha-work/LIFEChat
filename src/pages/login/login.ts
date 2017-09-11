import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import * as $ from 'jquery';

import { ConfigService } from './../../services/config.service';
import { CommonService } from './../../services/common.service';
import {Database} from './../../services/database.service';
import {MessageService} from './../../services/message.service';
import {LogInService} from './../../services/login.service';
import {User} from './../../interfaces/user.interface';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController, private common: CommonService, private database: Database,  private message: MessageService, private config: ConfigService, private loginService: LogInService, private events: Events) {
  } 

  private validate(phn: string, password: string): boolean {
    let phoneNumberDOM = $("page-login #txt_userPhoneNumber");
    let passwordDOM = $("page-login #txt_password");
    
    if(this.common.validatePhoneNumber(phn)) {
      phoneNumberDOM.css({
        "border-bottom": "1px solid green"
      });
    } else {
      phoneNumberDOM.css({
        "border-bottom": "1px solid red"
      });
      return false;
    }
    if(this.common.validatePassword(password)) {
      passwordDOM.css({
        "border-bottom": "1px solid green"
      });
    } else {
      passwordDOM.css({
        "border-bottom": "1px solid red"
      });
      return false;
    }
    return true;
  }

  private disableLogInButton() {
    $("page-login #button_login").prop("disabled", "disabled").css({
      "opacity": "0.5"
    });
  }

  private enableLogInButton() {
    $("page-login #button_login").removeAttr("disabled").css({
      "opacity": "1"
    });
  }

  public beginLogin() {
    this.disableLogInButton();
    let phoneNumber = $("page-login #txt_userPhoneNumber").val().trim();
    let password = $("page-login #txt_password").val().trim();
    if (this.validate(phoneNumber, password)) {
      this.loginService.getUserObject(phoneNumber).then((value) => {
        if(password !== value.password) {
          alert(this.message.getMessage("PHONENUMBER_PASSWORD_MISMATCH"));
          this.enableLogInButton();
        } else {
          let user: User;
          user = value;
          user.lastseen = Date.now();
          this.loginService.loginUser(user).then(() => {
            this.events.publish("USER-DETAILS-RECEIVED", value);
            this.events.publish("LOAD-CONTACTS");
            this.common.showPage("page-contacts");
            this.enableLogInButton();
          }).catch((message) => {
            alert(message);
            this.enableLogInButton();
          });
        }
      }).catch((message) => {
        alert(message);
        this.enableLogInButton();
      });
    } else {
      this.enableLogInButton();
    }
  }

  public goToSignUpPage() {
    this.common.showPage("page-signup");
  }
  

  
}
