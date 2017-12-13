import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// my declaration
import * as $ from 'jquery';


import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { LoginPage } from '../pages/login/login';
import { JoinLIFEPage } from '../pages/join-life/join-life';
import { ConversationPage } from '../pages/conversation/conversation';
import { ImagePage } from '../pages/image/image';

// importing services
import {LoginService} from './../services/login.service'
import { HomePage } from '../pages/home/home';
import { FileService } from './../services/file.service';
import {AlertService} from "./../services/alert.service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
    rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private loginService: LoginService, private file: FileService, private alertService: AlertService) {
    
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      
      statusBar.styleDefault();
      splashScreen.hide();
      this.file.checkAndCreateInitialDirectories().then(() => {
        this.navigateBasedOnUserStatus();
      }).catch((message) => {
        this.alertService.showAlert(message);
      });
      
    });
  }

  // public methods
  public action(actionName: string): void {
    switch (actionName) {
      case "login":
        this.navCtrl.push(LoginPage);
      break;
      case "conversation":  
        this.navCtrl.push(ConversationPage);
      break;
      case "image":  
        this.navCtrl.push(ImagePage);
      break;
    }
    
    this.closeMenu();
  }

  public closeMenu(): void {
    $("#menu-button-close").trigger('click');
  }

  private navigateBasedOnUserStatus() {
    this.loginService.isLoogedIn().then((userData) => {
      // user logged in going to home page
      this.rootPage = TabsControllerPage;
      this.navCtrl.push(HomePage);
    }).catch(() => {
      // no logged in user going to login page
      //this.rootPage = LoginPage;
      this.navCtrl.push(LoginPage);
    });
  }
}

