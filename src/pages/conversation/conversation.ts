import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import * as $ from 'jquery';

import {CommonService} from './../../services/common.service';
import {ConversationService} from './../../services/conversation.service';
import {FileService} from './../../services/file.service';

import {Message} from './../../interfaces/message.interface';

@Component({
  selector: 'page-conversation',
  templateUrl: 'conversation.html'
})
export class ConversationPage {
  public model: any;

  private presentFileIndex: any;
  constructor(public navCtrl: NavController, private conversation: ConversationService, private common: CommonService, private file: FileService, private events: Events) {
    this.presentFileIndex = 0;
    this.model = {};
    this.model.chatData = [];
    this.model.user = this.conversation.getCurrentUserData();
    this.displayImage(this.model.user.image);
    this.model.user.lastSeen = this.common.getTimeFromTimeStamp(this.model.user.lastSeen);
    this.bindEvents();
    this.populateChat(this.model.user.phoneNumber);
  }

  private bindEvents() {
    this.events.subscribe("CHAT-FILE-UPDATED", (value)=> {
      this.populateChat(value);
    });
  }

  private populateChat(fromPhoneNumber?: string) {
    this.conversation.getChatDataFileList(fromPhoneNumber).then(() => {
      //alert("hello"+sessionStorage["presentChatFileList"]);
      let fileListArray = JSON.parse(sessionStorage["presentChatFileList"]);
      let file = fileListArray[this.presentFileIndex];
      this.conversation.getChatDataFromFile(file).then((value) => {
        
        for(let index=0; index< value.length; index++) {
          if(value[index].from === this.model.user.phoneNumber) {
            value[index].isReceived = true;
            value[index].isSent = false;
          } else {
            value[index].isReceived = false;
            value[index].isSent = true;
          }
        }alert(JSON.stringify(value));
        this.model.chatData = value;
      }).catch(() => {
        alert("unable to load chat data");
      });
    }).catch(() => {
      alert("unable to load chat data");
    });
  }

  private displayImage(imageName: any) {
    this.file.readFile(imageName).then((dataFromFile) => {
      this.model.user.image = dataFromFile;
    }).catch(() => {
      this.model.user.image = "assets/img/no-photo_40x40.png";
    });
  }

  sendMessage() {
    let messageText = $("#txt_message").val();
    if(messageText.trim() !== "") {
      this.conversation.sendMessage(messageText, this.model.user.phoneNumber);
    }
    $("#txt_message").val("");
  }
}
