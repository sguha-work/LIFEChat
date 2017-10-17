import {Injectable} from '@angular/core';
import { Events } from 'ionic-angular';

import {CommonService} from './common.service';
import {FileService} from './file.service';
import {Database} from './database.service';

import {Message} from './../interfaces/message.interface';
import {User} from './../interfaces/user.interface';

@Injectable()
export class ConversationService {

    constructor(private common: CommonService, private file: FileService, private database: Database, private events: Events) {
        this.bindEvents();
    }

    private bindEvents() {
        this.events.subscribe("MESSAGES-RECEIVED", (value) => {
            this.receiveMessage(value);
        });
    }

    private prepareAndShowNotofication(messages: any): Promise<any> {
        return new Promise((resolve, reject) => {

        })
    }

    private writeMessegeToProperFile(message: Message): Promise<any> {
        return new Promise((resolve, reject) => {
            let chatFileName = this.common.getChatFileName(message.from);
            this.file.checkIfFileExists(chatFileName).then((dataFromFile) => {
                let messageArray = JSON.parse(dataFromFile);
                messageArray.push(message);
                this.file.writeFile(JSON.stringify(messageArray), chatFileName).then(() => {
                    this.events.publish("CHAT-FILE-UPDATED", message.from);
                    resolve();
                }).catch(() => {
                    this.events.publish("CHAT-FILE-UPDATED", message.from);
                    resolve();
                });
            }).catch(() => {
                let messageArray = [];
                messageArray.push(message);
                this.file.writeFile(JSON.stringify(messageArray), chatFileName).then(() => {
                    this.events.publish("CHAT-FILE-UPDATED", message.from);
                    resolve();
                }).catch(() => {
                    this.events.publish("CHAT-FILE-UPDATED", message.from);
                    resolve();
                });
            });
        });
    }

    private updateMessagesToFile(messages: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let keys = Object.keys(messages);
            let promiseArray = [];
            for(let keysIndex=0; keysIndex<keys.length; keysIndex++) {
                let promise = new Promise((res, rej) => {
                    this.writeMessegeToProperFile(messages[keys[keysIndex]]).then(() => {
                        res();
                    }).catch(() => {
                        res();
                    });
                });
                promiseArray.push(promise);
            }
            Promise.all(promiseArray).then(() => {
                resolve();
            }).catch(() => {
                resolve();
            });
        })
    }

    private clearChatDatabase() {
        alert("database clear called");
    }

    private receiveMessage(value: any) {
        //alert("new message "+JSON.stringify(value));
        this.prepareAndShowNotofication(value);
        this.updateMessagesToFile(value).then(() => {
            this.clearChatDatabase();
        }).catch(() => {});
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
            this.createMessageObject(messageText, toPhoneNumber).then((messageObject: Message) => {
                let chatFileName = this.common.getChatFileName(toPhoneNumber);
                this.file.checkIfFileExists(chatFileName).then((data) => {
                    this.writeMessgeObjectToChatFile(messageObject, chatFileName).then(() => {
                        resolve(messageObject);
                    }).catch(() => {
                        // unable to write chat object to file so rejecting
                        reject();
                    });
                }).catch(() => {
                    this.file.writeFile("[]", chatFileName).then(() => {
                        this.writeMessgeObjectToChatFile(messageObject, chatFileName).then(() => {
                            resolve(messageObject);
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
        return userData;
    }

    public getLatestConversation(phoneNumber: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getChatFileList(phoneNumber).then(() => {
                
            }).catch(() => {
                reject();
            });
        });
    }

    public getChatFileList(phoneNumber: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.file.getAllChatFile().then((allChatFileList) => {
                let chatFileList = [];
                for(let fileIndex=0; fileIndex<allChatFileList.length; fileIndex++) {
                    if(allChatFileList[fileIndex].indexOf(phoneNumber) !== -1) {
                        chatFileList.push(allChatFileList[fileIndex]);
                    }
                }
                resolve(chatFileList);
            }).catch(() => {
                reject();
            });
        });
    }

    public getChatDataFileList(phoneNumber: string, date?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getChatFileList(phoneNumber).then((chatFileList) => {
                chatFileList = this.common.sortChatFileNameDateWise(chatFileList);
                sessionStorage["presentChatFileList"] = JSON.stringify(chatFileList);
                resolve(chatFileList);
            }).catch(() => {
                reject();
            });
        });
    }

    public getChatDataFromFile(fileName: string) {

    }
}