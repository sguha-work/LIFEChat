import {Injectable} from '@angular/core';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

import {User} from './../interfaces/user.interface';
import {FileService} from './file.service';
import {MessageService} from './message.service';

@Injectable()
export class CommonService {

    constructor(private uniqueDeviceID: UniqueDeviceID, private file: FileService, private messageService: MessageService) {

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
            this.file.checkAndCreateInitialDirectories().then(() => {
                this.file.readFile("user").then((value) => {
                    let userData = JSON.parse(value);
                    localStorage["user"] = value;
                    resolve(userData as User);
                }).catch(() => {
                    // cant read user data
                    reject(this.messageService.messages.UNABLE_TO_CONNECT_TO_DATABASE);
                });
            }).catch(() => {

            });
            
        });
    }

    public getMMYYYY(): string {
        let date = new Date();
        let month = date.getMonth(); 
        let monthString = "";
        if(month<10) {
            monthString = "0" + month.toString();
        }
        return monthString + "-" + date.getFullYear();
    }

    public getChatFileName(phoneNumber: string): string {
        let chatFileName = phoneNumber+"_"+this.getMMYYYY()+".chat";
        return chatFileName;
    }

    // return true if first is larger than second
    private isLargeMMYYYY(mmyyyy1: string, mmyyyy2: string): any {
        let mm1, yyyy1, mm2, yyyy2;
        
        mm1 = parseInt(mmyyyy1.split("-")[0]);
        yyyy1 = parseInt(mmyyyy1.split("-")[1]);

        mm2 = parseInt(mmyyyy2.split("-")[0]);
        yyyy2 = parseInt(mmyyyy2.split("-")[1]);

        if(mm2>mm1) {
            return false;
        }

        if(mm2 === mm1) {
            if(yyyy2>yyyy1) {
                return false;
            }
        }

        return true;
    }

    public sortChatFileNameDateWise(chatFileList: any): any {
        for(let index1=0; index1<chatFileList.length; index1++) {
            for(let index2=0; index2<chatFileList.length-1-index1; index2++) {
                let mmyyyy1 = chatFileList[index2].split("_").pop().split(".")[0];
                let mmyyyy2 = chatFileList[index2+1].split("_").pop().split(".")[0];
                if(!this.isLargeMMYYYY(mmyyyy1, mmyyyy2)) {
                    let temp = chatFileList[index2];
                    chatFileList[index2] = chatFileList[index2 +1];
                    chatFileList[index2+1] = temp;
                }
            }
        }
        return chatFileList;
    }

    public updateMessageArray(messageArray: any, phoneNumber: string): any {
        for(let index=0; index< messageArray.length; index++) {
            if(messageArray[index].from === phoneNumber) {
              messageArray[index].isReceived = true;
              messageArray[index].isSent = false;
            } else {
              messageArray[index].isReceived = false;
              messageArray[index].isSent = true;
            }
            messageArray[index].time = this.getTimeFromTimeStamp(parseInt(messageArray[index].senton));
          }
          return messageArray;
    }

    public encryptPassword(password: string): string {
        let newPassword: string;
        newPassword = btoa(password);
        return newPassword;
    }
}