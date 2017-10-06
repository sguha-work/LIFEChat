import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
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
  constructor(public navCtrl: NavController, private conversation: ConversationService, private common: CommonService, private file: FileService) {
    this.model = {};
    this.model.user = this.conversation.getCurrentUserData();
    this.displayImage(this.model.user.image);
    this.model.user.lastSeen = this.common.getTimeFromTimeStamp(this.model.user.lastSeen);alert(JSON.stringify(this.model.user));
  }

  private displayImage(imageName: any) {
    this.file.readFile(imageName).then((dataFromFile) => {
      this.model.user.image = dataFromFile;
    }).catch(() => {
      this.model.user.image = "assets/img/no-photo_40x40.png";
    });
  }

  sendMessage() {
    alert($("#txt_message").val());
    let messageText = $("#txt_message").val();
    this.conversation.sendMessage(messageText, this.model.user.phoneNumber);
  }
}
