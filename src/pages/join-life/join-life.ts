import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import {CommonService} from "./../../services/common.service";
import {SignupService} from "./../../services/signup.service";
import {User} from "./../../interfaces/user.interface";

interface FileReaderEventTarget extends EventTarget {
  result:string
}

interface FileReaderEvent extends Event {
  target: FileReaderEventTarget;
  getMessage():string;
}

@Component({
  selector: 'page-join-life',
  templateUrl: 'join-life.html'
})
export class JoinLIFEPage implements AfterViewInit{

  private phoneNUmberDOM: any;
  private passwordDOM: any;
  private emailDOM: any;
  private imageDOM: any;
  private imageThumbnailDOM: any;
  private imageData: any;

  constructor(public navCtrl: NavController, private common: CommonService, private signUp: SignupService) {
    this.imageData = null;
  }

  private readURL(input) {
    
      if (input.files && input.files[0]) {
          var reader = new FileReader();
  
          reader.onload = (e: FileReaderEvent) => {
              this.imageThumbnailDOM.attr('src', e.target.result);
              this.imageData = e.target.result;
          }
  
          reader.readAsDataURL(input.files[0]);
      }
  }

  private validate() {
    let phoneNUmber = this.phoneNUmberDOM.val().toString().trim();
    if(!this.common.validatePhoneNumber(phoneNUmber)) {
      this.phoneNUmberDOM.css({
        "border-bottom": "1px solid red"
      });
      return false;
    } else {
      this.phoneNUmberDOM.css({
        "border-bottom": "1px solid transparent"
      });
    }

    let password = this.passwordDOM.val().toString().trim();
    if(!this.common.validatePassword(password)) {
      this.passwordDOM.css({
        "border-bottom": "1px solid red"
      });
      return false;
    } else {
      this.passwordDOM.css({
        "border-bottom": "1px solid transparent"
      });
    }

    let email = this.emailDOM.val().toString().trim();
    if(!this.common.validateEmail(email)) {
      this.emailDOM.css({
        "border-bottom": "1px solid red"
      });
      return false;
    } else {
      this.emailDOM.css({
        "border-bottom": "1px solid transparent"
      });
    }

    return true;
  }
  
  beginSignUp() {
    if(this.validate()) {
      let user: User;
      
      user.phoneNumber = this.phoneNUmberDOM.val().toString().trim();
      user.password = this.passwordDOM.val().toString().trim();
      user.email = this.emailDOM.val().toString().trim();
      if(this.imageData !== null) {
        user.image = this.imageData;
      }
      this.signUp.getDeviceID().then((uuid) => {
        alert(JSON.stringify(uuid));
      });

    }
  }

  triggerUploadFile() {
    $("#file_image").trigger("click");
  }

  ngAfterViewInit() {
    this.phoneNUmberDOM = $("#txt_phoneNumber input");
    this.passwordDOM = $("#txt_password input");
    this.emailDOM = $("#txt_email input");
    this.imageThumbnailDOM = $('#img_profileImage');
    this.imageDOM = $("#file_image input");
  }

  displayImageThumbnail(event: any) {
    this.readURL(event.currentTarget);
  }
}
