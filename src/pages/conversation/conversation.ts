import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import * as $ from 'jquery';

@IonicPage()
@Component({
  selector: 'page-conversation',
  templateUrl: 'conversation.html',
})
export class ConversationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  public textInputFocus() {
    let conversationDiv: any;
    conversationDiv = $("#conversation");
    conversationDiv.animate({ scrollTop: conversationDiv.prop("scrollHeight")}, 1000);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConversationPage');
  }

}
