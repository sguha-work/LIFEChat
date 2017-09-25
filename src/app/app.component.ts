import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AfterViewInit } from '@angular/core';
import { Events } from 'ionic-angular';

// my declaration
import * as $ from 'jquery';


import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { LoginPage } from '../pages/login/login';

import {LoginService} from './../services/login.service';
import {CommonService} from './../services/common.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp  implements AfterViewInit {
  @ViewChild(Nav) navCtrl: Nav;
    rootPage:any = "";

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private loginService: LoginService, private events: Events, private common: CommonService) {
    // platform.ready().then(() => {
    //   // Okay, so the platform is ready and our plugins are available.
    //   // Here you can do any higher level native things you might need.
    //   statusBar.styleDefault();
    //   splashScreen.hide();
    // });
    this.redirectToLoginIfuserDoesnotExists();
  }

  private redirectToLoginIfuserDoesnotExists() {
    this.loginService.isLoggedIn().then(() => {
      this.navCtrl.push(TabsControllerPage);
    }).catch(() => {
      this.navCtrl.push(LoginPage);
    });
  }

  private updateDisplayebleUserData() {
    this.common.getPresentUserData().then((userData) => {
      // updating user data
      $("#lbl_myPhoneNumber").text(userData.phoneNumber);
      if(typeof userData.image !== "undefined" && userData.image !== null && userData.image !== "") {
        $("#img_myProfilePhoto").attr("src", userData.image);
      }
      
    }).catch(() => {
      // failed to update user data
    });
  }

  private bindEvents() {
    this.events.subscribe("USER_UPDATED", () => {
      this.updateDisplayebleUserData();
    });
  }

  // public methods
  public action(actionName: string): void {
    // switch (actionName) {
    //   case "login":
    //     this.navCtrl.push(LoginPage);
    //   break;
    //   case "conversation":  
    //     this.navCtrl.push(ConversationPage);
    //   break;
    //   case "image":  
    //     this.navCtrl.push(ImagePage);
    //   break;
    // }
    
    this.closeMenu();
  }

  public closeMenu(): void {
    $("#menu-button-close").trigger('click');
  }
  
  ngAfterViewInit() {
    this.bindEvents();
  }
}
