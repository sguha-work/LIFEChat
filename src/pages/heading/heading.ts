import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CommonService} from "./../../services/common.service";
import { AfterViewInit } from '@angular/core';
import { Events } from 'ionic-angular';
import * as $ from 'jquery';
import {User} from './../../interfaces/user.interface';
@Component({
  selector: 'page-heading',
  templateUrl: 'heading.html',
})
export class HeadingPage  implements AfterViewInit{

  constructor(public navCtrl: NavController, public navParams: NavParams, private common: CommonService, public events: Events) {
    this.bindEvents();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HeadingPage');
  }

  private displayProfilePicture(pictureData: string) {
    if(pictureData !== "") {
      $("page-heading #image_myProfile").attr('src', pictureData);
    }
    
  }

  private populateData(data: User) {
    this.displayProfilePicture(data.picture);
    $("page-heading #image_contacts").show();
  }

  private bindEvents() {
   this.events.subscribe("USER-DETAILS-RECEIVED", (value) => {
     this.populateData(value);
   });
  }

  public displayContacts() {
    this.common.showPage("page-contacts");
  }

  public changePhoneNumber() {
    
  }

  private adjustStyle() {
    
  }

  ngAfterViewInit() {
    this.adjustStyle();
    
  }

}
