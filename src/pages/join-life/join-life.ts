import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { LoginPage } from '../login/login';
import {CommonService} from "./../../services/common.service";
import {SignupService} from "./../../services/signup.service";
import {AlertService} from "./../../services/alert.service";
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

  constructor(public navCtrl: NavController, private common: CommonService, private signUp: SignupService, private alertService: AlertService) {
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

  private startDatabaseActivity(user: User) {
    this.signUp.isUserExists(user.phoneNumber).then((value) => {
      if(value) {
        this.alertService.showAlert("User already exists, please sign in", "User already exists");
      } else {
        this.signUp.writeUserDataToDatabase(user).then(() => {
          this.alertService.showAlert("Registration done, please sign in", "Registration Successfull");
          this.navCtrl.push(LoginPage);
        }).catch(() => {
          this.alertService.showAlert("Unable to connect to database", "Connection problem");    
        });
      }
    }).catch(() => {
      this.alertService.showAlert("Unable to connect to database", "Connection problem");
    });
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
      let user: any;
      user = {};
      user as User;
      user.phoneNumber = this.phoneNUmberDOM.val().toString().trim();
      user.password = this.passwordDOM.val().toString().trim();
      user.email = this.emailDOM.val().toString().trim();
      if(this.imageData !== null) {
        user.image = this.imageData;
      }
      this.signUp.getDeviceID().then((uuid) => {
        user.loggedInDeviceId = uuid.toString();
        this.startDatabaseActivity(user);
      }).catch(() => {
        this.alertService.showAlert("Error fetching device id, user cannot be registerred. Make sure to give call/phone access.", "Error");
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

  gotoLoginPage() {
    this.navCtrl.push(LoginPage);
  }
}
