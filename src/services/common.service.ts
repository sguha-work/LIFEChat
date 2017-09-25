import {Injectable} from '@angular/core';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

import {FileService} from './file.service';
@Injectable()
export class CommonService {

    constructor(private uniqueDeviceID: UniqueDeviceID, private file: FileService) {

    }

    public getTimeFromTimeStamp(timeStamp) {
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

    public getDeviceID(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.uniqueDeviceID.get().then((uuid: any) => {
                resolve(uuid);
            }).catch((error: any) => {
                reject();
            });
        });
    }

    public getPresentUserData(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.file.readFile("user").then((value) => {
                let userData = JSON.parse(value);
                resolve(userData);
            }).catch(() => {
                // cant read user data
            });
        });
    }
}