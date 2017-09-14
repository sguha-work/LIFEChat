import { Component } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { Events } from 'ionic-angular';
import * as $ from 'jquery';

import {ConversationService} from './../../services/conversation.service';
import {LocalStorageService} from './../../services/localStorage.service';
import {Message} from './../../interfaces/message.interface';
@Component({
  selector: 'page-conversation',
  templateUrl: 'conversation.html',
})
export class ConversationPage   implements AfterViewInit{

  public model: any;
  constructor(private events: Events, private conversation: ConversationService, private localStorageService: LocalStorageService) {
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

  private loadConversation(userData: any) {
    // loading user details
    if(Array.isArray(userData)) {
      // if userData is array then userData[2] will be the life object
      this.model.phoneNumber = userData[0];
      this.model.name = userData[1];
      this.alterImageIfNeeded(userData[2]);
    }

    // loading conversation
    
  }

  private enableSendButton() {
    $("#button_send").css({
      "pointer-events": "all"
    });
  }

  private disableSendButton() {
    $("#button_send").css({
      "pointer-events": "none"
    });
  }

  public sendMessage() {
    let reply = $("#txt_reply").val().trim();
    $("#txt_reply").val("");
    let myData = this.localStorageService.getFromSession("user");
    let messageObject: Message;
    this.disableSendButton();
    messageObject.to = this.model.phoneNumber;
    messageObject.senton = Date.now();
    messageObject.deliverredon = 0;
    messageObject.from = myData.phoneNumber;
    messageObject.status = 0;
    messageObject.readon = 0;
    messageObject.message = reply;

    this.conversation.sendMessage(messageObject).then(() => {
      this.enableSendButton();
    }).catch(() => {
      this.enableSendButton();
    });
  }

  private bindEvents() {
    this.events.subscribe("LOAD-CONVERSATION", (userData: string) => {
      this.loadConversation(userData);
    });
  }

  ngAfterViewInit() {
    $("page-conversation #txt_reply").focus();
    this.bindEvents();
  }
}
