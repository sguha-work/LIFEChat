import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ConversationService} from "./../../services/conversation.service";
import {CommonService} from "./../../services/common.service";
import {FileService} from "./../../services/file.service";
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-conversation',
  templateUrl: 'conversation.html'
})
export class ConversationPage implements OnDestroy {

  private timer: any;
  public model: any;

  constructor(public navCtrl: NavController, private conversationService: ConversationService, private commonService: CommonService, private fileService: FileService, private events: Events) {
    this.model = {};
    this.model.chatData = [];
    //this.startTimer();
    //this.events.publish("CHAT-FILE-UPDATED", message.from);
    let fromUser = JSON.parse(sessionStorage["chatWith"]);
    this.populateChatData(fromUser.phoneNumber);
    this.events.subscribe("CHAT-FILE-UPDATED", (fromPhoneNumber) => {
      this.populateChatData(fromPhoneNumber);
    });
  }

  private populateChatData(fromPhoneNumber: any) {
    let user = JSON.parse(localStorage["user"]);
    let fromUser = JSON.parse(sessionStorage["chatWith"]);
    if(fromPhoneNumber === fromUser.phoneNumber) {
      let chatFileName = this.commonService.getChatFileName(fromPhoneNumber);
      this.fileService.readFile(chatFileName).then((data) => {
        this.model.chatData = JSON.parse(data);
        alert(data);
      }).catch((error) => {
        alert(JSON.stringify(error));
      });
    }
    
  }

  private startTimer() {
    // this.timer = window.setInterval(() => {
    //   this.populateChatData();
    // }, 5000);
  }

  private stopTimer() {
    //window.clearInterval(this.timer);
  }

  ngOnDestroy() {
      this.stopTimer();
  }
  
}
