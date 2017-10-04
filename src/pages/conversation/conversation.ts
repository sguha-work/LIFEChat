import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {ConversationService} from './../../services/conversation.service';

import {Message} from './../../interfaces/message.interface';

@Component({
  selector: 'page-conversation',
  templateUrl: 'conversation.html'
})
export class ConversationPage {
  public model: any;
  constructor(public navCtrl: NavController, private conversation: ConversationService) {
    this.model = {};
    this.model.user = this.conversation.getCurrentUserData();alert("hello"+JSON.stringify(this.model.user));
  }
  sendMessage() {
    alert("send messege called");
  }
}
