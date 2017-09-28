import {Injectable} from '@angular/core';
import { Events } from 'ionic-angular';

import {CommonService} from './common.service';

import {Message} from './../interfaces/message.interface';
import {User} from './../interfaces/user.interface';

@Injectable()
export class ConversationService {

    constructor(private common: CommonService) {

    }

    private createMessageObject(messageText: string, toPhoneNumber: string): Promise<any> {
        let messageObject: Message;
        return new Promise((resolve, reject) => {
            messageObject.to = toPhoneNumber;
            messageObject.message = messageText;
            messageObject.senton = Date.now();
            if(typeof localStorage["userPhoneNumber"] === "undefined" || typeof localStorage["deviceId"] === "undefined") {
                this.common.getPresentUserData().then((userData: User) => {
                    messageObject.from = userData.phoneNumber;
                    messageObject.sentFromDevice = userData.loggedInDeviceId;
                    resolve(messageObject);
                }).catch(() => {
                    // unable to fetch user information
                    reject();
                });
            } else {
                messageObject.from = localStorage["userPhoneNumber"];
                messageObject.sentFromDevice = localStorage["deviceId"];
                resolve(messageObject);
            }
        });
    }
    
    private backupConversationToLocalFile(messageText: string, toPhoneNumber: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.createMessageObject(messageText, toPhoneNumber).then((messageObject: Message) => {
                
            }).catch(() => {
                // unable to get user data
                reject();
            });
        });
    }

    private sendMessageToDatabase(messageObject: Message): Promise<any> {
        return new Promise(() => {
            
        });
    }

    public sendMessage(messageText: string, toPhoneNumber: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.backupConversationToLocalFile(messageText, toPhoneNumber).then((messageObject) => {
                this.sendMessageToDatabase(messageObject).then(() => {
                    resolve(messageObject);
                }).catch(() => {
                    // unable to sent message, db connection failed
                    reject();
                });
            }).catch(() => {
                // failed to create local backup of message, chat cannot be sent
                reject();
            });
        });
    }
}