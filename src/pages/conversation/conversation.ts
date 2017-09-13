import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AfterViewInit } from '@angular/core';
import { Events } from 'ionic-angular';
import * as $ from 'jquery';

@Component({
  selector: 'page-conversation',
  templateUrl: 'conversation.html',
})
export class ConversationPage   implements AfterViewInit{

  public model: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private events: Events) {
    this.model = {};
  }

  public textInputFocus() {
    let conversationDiv: any;
    conversationDiv = $("#conversation");
    conversationDiv.animate({ scrollTop: conversationDiv.prop("scrollHeight")}, 1000);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConversationPage');
  }

  private alterImageIfNeeded(data: any) {
    if(data.picture === "" || data.picture === null) {
      this.model.picture = "assets/images/no-photo.jpg";
    } else {
      this.model.picture = data.picture;
    }
  }

  private loadConversation(data: any) {
    if(Array.isArray(data)) {
      this.model.phoneNumber = data[0];
      this.model.name = data[1];
      this.alterImageIfNeeded(data[2]);
    }
    
  }

  private bindEvents() {
    this.events.subscribe("LOAD-CONVERSATION", (data: string) => {
      this.loadConversation(data);
    });
  }

  ngAfterViewInit() {
    $("page-conversation #txt_reply").focus();
    this.bindEvents();
  }
}
