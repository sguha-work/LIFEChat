import {Injectable} from '@angular/core';
import { Events } from 'ionic-angular';

import {CommonService} from './common.service';
import {FileService} from './file.service';
import {Database} from './database.service';

import {Message} from './../interfaces/message.interface';
import {User} from './../interfaces/user.interface';

@Injectable()
export class ConversationService {

    constructor(private common: CommonService, private file: FileService, private database: Database) {

    }

    private createMessageObject(messageText: string, toPhoneNumber: string): Promise<any> {
        let messageObject: any;
        messageObject = {};
        return new Promise((resolve, reject) => {
            messageObject.to = toPhoneNumber;
            messageObject.message = messageText;
            messageObject.senton = Date.now();
            if(typeof localStorage["userPhoneNumber"] === "undefined" || typeof localStorage["deviceId"] === "undefined") {
                this.common.getPresentUserData().then((userData: User) => {
                    messageObject.from = userData.phoneNumber;
                    messageObject.sentFromDevice = userData.loggedInDeviceId;
                    localStorage["userPhoneNumber"] = userData.phoneNumber;
                    localStorage["deviceId"] = userData.loggedInDeviceId;
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

    private writeMessgeObjectToChatFile(messegeObject: Message, chatFileName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.file.readFile(chatFileName).then((dataFromFile) => {
                let chatData = JSON.parse(dataFromFile);
                chatData.push(messegeObject);
                this.file.writeFile(JSON.stringify(chatData), chatFileName).then(() => {
                    resolve();
                }).catch(() => {
                    // unable to write file so rejecting
                });
            }).catch(() => {
                // unable to read chat file so rejecting
                reject();
            });
        });
    }
    
    private backupConversationToLocalFile(messageText: string, toPhoneNumber: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.createMessageObject(messageText, toPhoneNumber).then((messageObject: Message) => {alert(JSON.stringify(messageObject));
                let chatFileName = toPhoneNumber+"-"+this.common.getMMYYYY()+".chat";
                this.file.checkIfFileExists(chatFileName).then(() => {
                    this.writeMessgeObjectToChatFile(messageObject, chatFileName).then(() => {
                        resolve();
                    }).catch(() => {
                        // unable to write chat object to file so rejecting
                        reject();
                    });
                }).catch(() => {
                    this.file.writeFile("{}", chatFileName).then(() => {
                        this.writeMessgeObjectToChatFile(messageObject, chatFileName).then(() => {
                            resolve();
                        }).catch(() => {
                            // unable to write chat object to file so rejecting
                            reject();
                        });
                    }).catch(() => {
                        // unable to create file so rejecting
                        reject();
                    });
                });
            }).catch(() => {
                // unable to get user data
                reject();
            });
        });
    }

    private sendMessageToDatabase(messageObject: Message): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.writeMessageToDatabase(messageObject.to, messageObject).then(() => {
                resolve();
            }).catch(() => {
                reject();
            });
        });
    }

    public turnOnConversationConnection(phoneNumber: string) {
        this.database.turnOnConversationConnection(phoneNumber);
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

    public getCurrentUserData() {
        let userData = JSON.parse(sessionStorage["currentActiveUser"]);
        sessionStorage["currentActiveUser"] = null;
        return userData
    }
}