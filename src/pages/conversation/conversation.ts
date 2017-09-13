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

  constructor(public navCtrl: NavController, public navParams: NavParams, private events: Events) {
  }

  public textInputFocus() {
    let conversationDiv: any;
    conversationDiv = $("#conversation");
    conversationDiv.animate({ scrollTop: conversationDiv.prop("scrollHeight")}, 1000);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConversationPage');
  }

  private loadConversation(data: any) {
    
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
