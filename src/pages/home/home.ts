import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ConversationPage} from './../conversation/conversation';
import {HeadingPage} from './../heading/heading';
import {ContactsPage} from './../contacts/contacts';
import { AfterViewInit } from '@angular/core';
import { SearchPage } from './../search/search';
import { Events } from 'ionic-angular';
import { Platform } from 'ionic-angular';

import { ConfigService } from './../../services/config.service';
import { CommonService } from './../../services/common.service';
import {LogInService} from './../../services/login.service';
import * as $ from 'jquery';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage  implements AfterViewInit{

  constructor(public navCtrl: NavController, private config: ConfigService, public events: Events, private common: CommonService, private platForm: Platform, private login: LogInService) {
       
  }

  private initialCheck() {
    if(this.platForm.is("cordova")) {
      // this.login.checkIfLocalLoginFileExists().then((value) => {
      //   this.common.showPage("page-contacts");
      //   this.events.publish("USER-DETAILS-RECEIVED", value);
      // }).catch(() => {
      //   this.common.showPage("page-login");  
      // });
      this.common.showPage("page-login");
    } else {
      this.common.showPage("page-login");
    }
  }
  
  

  ngAfterViewInit() {
    this.initialCheck();
    if($(window).width() < 800) {
      $("page-conversation").hide();
    } else {
      $("page-conversation").show();
    }
  }
}
 