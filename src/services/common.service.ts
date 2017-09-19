import {Injectable} from '@angular/core';
import { Events } from 'ionic-angular';
import * as $ from 'jquery';

import {Database} from './database.service';
@Injectable()
export class CommonService {
    
    constructor(private database: Database) {

    }

    public showPage(pageName: string): void {
        let pageArray = [
            "page-contacts",
            "page-conversation",
            "page-login",
            "page-signup"
        ];

        for(let index=0; index<pageArray.length; index++) {
            if(pageArray[index] === pageName) {
                $(pageArray[index]).show();
            } else {
                $(pageArray[index]).hide();
            }
        }

    }

    public validatePhoneNumber(phoneNumber: string): boolean {
        if(isNaN(parseInt(phoneNumber))) {
            return false;
        }
        if(phoneNumber.length !== 10) {
            return false;
        }
        return true;
    }

    public validatePassword(password: string): boolean {
        if(password.length < 5) {
            return false;
        }
        return true;
    }

    public validateEmail(email: string): boolean {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    public invokeReadConnection(myPhoneNumber: string) {
        this.database.receiveConversation(myPhoneNumber);
    }

    public getTimeFromTimeStamp(timeStamp: string): string {
        let date = new Date(timeStamp);
        let year    = date.getFullYear();
        let month   = date.getMonth()+1;
        let day     = date.getDate();
        let hour    = date.getHours().toString();
        let minute  = date.getMinutes();
        let seconds = date.getSeconds();
        if(parseInt(hour)>12) {
            hour = (parseInt(hour) - 12).toString()+":"+minute+":"+seconds+" PM";
        } else {
            if(hour === "00") {
                hour = "12";
            }
            hour = hour+":"+minute+":"+seconds+" AM";
        }
         
        return day+"-"+month+"-"+year+" "+hour;
    }
}