import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// my declaration
import * as $ from 'jquery';

import {CommonService} from "./../services/common.service";


import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
    rootPage:any = TabsControllerPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private common: CommonService) {
    
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.common.getPresentUserData().then(() => {
        // present user data found so going to home page
        this.navCtrl.push(HomePage);
      }).catch(() => {
        
        // no present user found going to login page
        this.navCtrl.push(LoginPage);
      });
    });
  }

  // public methods
  public action(actionName: string): void {
  }

  public closeMenu(): void {
    $("#menu-button-close").trigger('click');
  }
}
