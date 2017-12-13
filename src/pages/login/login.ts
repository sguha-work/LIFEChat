import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { TabsControllerPage } from '../tabs-controller/tabs-controller';
import { JoinLIFEPage } from '../join-life/join-life';
import { HomePage } from '../home/home';

import {CommonService} from "./../../services/common.service";
import {LoginService} from "./../../services/login.service";
import {AlertService} from "./../../services/alert.service";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage  implements AfterViewInit {

  private phoneNUmberDOM: any;
  private passwordDOM: any;
  private loginButtonDOM: any;
  public rootPage:any;

  constructor(public navCtrl: NavController, private menu: MenuController, private loginService: LoginService, private common: CommonService, private alertService: AlertService) {
    this.menu.swipeEnable(false);
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

  // private resetInputs() {
  //   this.phoneNUmberDOM.val("");
  //   this.passwordDOM.val("");
  // }

  private validate(): boolean {
    let phoneNumber = this.phoneNUmberDOM.val().trim();
    if(!this.common.validatePhoneNumber(phoneNumber)) {
      this.phoneNUmberDOM.css({
        "border-bottom": "1px solid red"
      });
      return false;
    } else {
      this.phoneNUmberDOM.css({
        "border-bottom": "1px solid transparent"
      });
    }

    let password = this.passwordDOM.val().trim();
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

  public login() {
    if(this.validate()) {
      let phoneNumber = this.phoneNUmberDOM.val().trim();
      let password = this.passwordDOM.val().trim();
      this.disableLoginButton();
      this.loginService.login(phoneNumber, password).then(() => {
          this.navCtrl.setRoot(TabsControllerPage);
          this.navCtrl.push(TabsControllerPage);
      }).catch((message) => {
        this.alertService.showAlert(message);
        this.enableLoginButton();
      });
    } else {
      this.enableLoginButton();
    }
  }

  public goToSignUpPage() {
    this.navCtrl.push(JoinLIFEPage);
  }

  ngAfterViewInit() {
    this.phoneNUmberDOM = $("page-login #txt_phoneNumber input");
    this.passwordDOM = $("page-login #txt_password input");
    this.loginButtonDOM = $("page-login #button_login");
  }
}
