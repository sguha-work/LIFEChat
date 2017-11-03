import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

// importing pages
import { LoginPage } from '../login/login';

// importing services
import {SignupService} from "./../../services/signup.service";
import {MessageService} from "./../../services/message.service";
import {AlertService} from "./../../services/alert.service";
import {CommonService} from "./../../services/common.service";

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
  private imageThumbnailDOM: any;
  private imageDOM: any;
  private signUpButtonDOM: any;
  private imageData: any;

  constructor(public navCtrl: NavController, private message: MessageService, private alertService: AlertService, private common: CommonService, private signUpService: SignupService) {
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

  private disableSignUpButton() {
    this.signUpButtonDOM.css({
      "opacity": "0.5",
      "pointer-events": "none"
    });
  }
  
  private enableSignUpButton() {
    this.signUpButtonDOM.css({
      "opacity": "1",
      "pointer-events": "all"
    });
  }

  private validate(): boolean {
    let email = this.emailDOM.val().trim();
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

    let phoneNumber = this.phoneNUmberDOM.val().trim();
    if(!this.common.validatePhoneNumber(phoneNumber)) {
      this.phoneNUmberDOM.css({
        "border-bottom": "1px solid red"
      });
      return false;
    } else {
      this.phoneNUmberDOM.css({
        "border-bottom": "1px solid transparent"
      });
    }

    let password = this.passwordDOM.val().trim();
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
    return true;
  }

  triggerUploadFile() {
    $("#file_image").trigger("click");
  }

  public displayImageThumbnail(event: any) {
    let extension = event.currentTarget.value.toString().split(".").pop();
    if(extension==="jpg" || extension === "png" || extension === "jpeg") {
      this.readURL(event.currentTarget);
    } else {
      this.alertService.showAlert(this.message.messages.IMAGE_NOT_SUPPORTED.en);
    }
    
  }

  public gotoLoginPage() {
    this.navCtrl.push(LoginPage);
  }

  public beginSignUp() {
    if(this.validate()) {
      let phoneNumber = this.phoneNUmberDOM.val().trim();
      let email = this.emailDOM.val().trim();
      let password = this.passwordDOM.val().trim();
      this.signUpService.signUp(phoneNumber, password, email).then(() => {

      }).catch((message) => {
        this.alertService.showAlert(message);
      });
    }
  }

  ngAfterViewInit() {
    this.phoneNUmberDOM = $("page-join-life #txt_phoneNumber input");
    this.passwordDOM = $("page-join-life #txt_password input");
    this.emailDOM = $("page-join-life #txt_email input");
    this.imageThumbnailDOM = $('page-join-life #img_profileImage');
    this.imageDOM = $("page-join-life #file_image input");
    this.signUpButtonDOM = $("page-join-life #button_signUp");
  }

}
