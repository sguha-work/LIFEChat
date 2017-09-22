import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// my declaration
import * as $ from 'jquery';


import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { LoginPage } from '../pages/login/login';

import {LoginService} from './../services/login.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
    rootPage:any = TabsControllerPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private loginService: LoginService) {
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
}
