import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as $ from 'jquery';

import { CommonService } from './../../services/common.service';
import {Database} from './../../services/database.service';
import {MessageService} from './../../services/message.service';
import {SignUpService} from './../../services/signup.service';
import {User} from './../../interfaces/user.interface';

interface FileReaderEventTarget extends EventTarget {
  result:string
}

interface FileReaderEvent extends Event {
  target: FileReaderEventTarget;
  getMessage():string;
}
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  private imageData;

  constructor(public navCtrl: NavController,  private common: CommonService, private database: Database,  private message: MessageService, private signup: SignUpService) {
    this.imageData = null;
  }

  private validate(phn: string, password: string): boolean {
    let phoneNumberDOM = $("page-signup #txt_userPhoneNumber");
    let passwordDOM = $("page-signup #txt_password");
    
    if(this.common.validatePhoneNumber(phn)) {
      phoneNumberDOM.css({
        "border-bottom": "1px solid green"
      });
    } else {
      phoneNumberDOM.css({
        "border-bottom": "1px solid red"
      });
      return false;
    }
    if(this.common.validatePassword(password)) {
      passwordDOM.css({
        "border-bottom": "1px solid green"
      });
    } else {
      passwordDOM.css({
        "border-bottom": "1px solid red"
      });
      return false;
    }
    return true;
  }

  public beginSignUp() {
    let phoneNumber = $("page-signup #txt_userPhoneNumber").val().trim();
    let password = $("page-signup #txt_password").val().trim();
    this.disableSignUpButton();
    if(this.validate(phoneNumber, password) === true) {
      this.signup.checkIfUserExists(phoneNumber).then((value) => {
        if(value === false) {
          // user doesnot exists continuing signup process
          let user: User;
          user = {phoneNumber: "", password: "", picture: "", lastseen: 0};
          user.phoneNumber = phoneNumber;
          user.password = password;
          if(this.imageData !== null) {
            user.picture = this.imageData;
          } else {
            user.picture = "";
          }
          user.lastseen = Date.now();
          this.signup.storeUserDataToDatabase(user).then(() => {
            alert(this.message.getMessage("SIGN_UP_SUCCESS"));
            this.enableSignUpButton();
            this.common.showPage("page-login");
          }).catch((message) => {
            // sign up failed due to no internet
            alert(message);
            this.enableSignUpButton();
          });
        } else {
          // user exists
          alert(value);
          this.enableSignUpButton();
        }
      }).catch((message) => {
        alert(message);
        this.enableSignUpButton();
      });
      
      
    } else {
      this.enableSignUpButton();
    }
  }

  private disableSignUpButton() {
    $("page-signup #button_signup").prop("disabled", "disabled").css({
      "opacity": "0.5"
    });
  }

  private enableSignUpButton() {
    $("page-signup #button_signup").removeAttr("disabled").css({
      "opacity": "1"
    });

    
  }

  
  private readURL(input) {
    
        if (input.files && input.files[0]) {
            var reader = new FileReader();
    
            reader.onload = (e: FileReaderEvent) => {
                $('#img_profileImage').attr('src', e.target.result);
                this.imageData = e.target.result;
            }
    
            reader.readAsDataURL(input.files[0]);
        }
    }
  

  public triggerUploadImage() {
    $("#file_image").trigger("click");
  }

  public displayImageThumbnail(event: any) {
    this.readURL(event.currentTarget);
  }

  

  goToLoginPage() {
    this.common.showPage("page-login");
  }
}
