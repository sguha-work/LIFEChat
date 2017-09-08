import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AfterViewInit } from '@angular/core';
import {CommonService} from "./../../services/common.service";
import * as $ from 'jquery';

@IonicPage()
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage   implements AfterViewInit {

  constructor(public navCtrl: NavController, public navParams: NavParams, private common: CommonService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactsPage');
  }

  loadConversation() {
    this.common.showPage("page-conversation");
  }

  private bindEvents() {

  }

  ngAfterViewInit() {
    this.bindEvents();
  }
}
