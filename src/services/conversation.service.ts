import { Inject, Injectable } from "@angular/core";
import { FirebaseApp } from "angularfire2";
import * as firebase from 'firebase';
import { Events } from 'ionic-angular';

import {Database} from './database.service';
import {Message} from './../interfaces/message.interface';
import {FileHandler} from './fileHandler.service';
import {LocalStorageService} from './localStorage.service';
import {CommonService} from './common.service';

@Injectable()
export class ConversationService {

    private _messaging: firebase.messaging.Messaging;

    constructor(@Inject(FirebaseApp) private _firebaseApp: firebase.app.App, private database: Database, private fileHandler: FileHandler, private event: Events, private localStorageService: LocalStorageService, private common: CommonService) {
        //this._messaging = firebase.messaging(this._firebaseApp);
        //this._messaging.requestPermission().then(() => {}).catch((error) => {});
        this.event.subscribe("MESSAGE-RECEIVED", (msgObject: Message) => {
            this.receiveMessageFileWork(msgObject);
        });
    }

    private getChatFilePrefix(): string {
        let d = new Date();
        return d.getDate() + "-" + (d.getMonth()+1)+"-"+d.getFullYear();
    }

    public receiveMessageFileWork(messageObject: Message) {
        let promiseArray = [];
        let keys = Object.keys(messageObject);
        let myData = this.localStorageService.getFromSession("user");
        for(let index=0; index<keys.length; index++) {
            let promise = new Promise((resolve, reject) => {
                let fileName = this.getChatFilePrefix()+"-"+keys[index];
                this.fileHandler.checkIfFileExists(fileName).then((value)=>{
                    let data = JSON.parse(value);
                    data[Date.now()] = messageObject[keys[index]];
                    this.fileHandler.writeFile(JSON.stringify(data), fileName).then(() => {
                        //this.event.publish("MESSAGE-UPDATED", fileName);             
                    }).catch(() => {});
                }).catch(() => {
                    let data = {};
                    data[Date.now()] = messageObject[keys[index]];
                    this.fileHandler.writeFile(JSON.stringify(data), fileName).then(() => {
                        //this.event.publish("MESSAGE-UPDATED", fileName);
                        this.database.deleteChat(myData.phoneNumber);
                    }).catch(() => {});
                });
            });
            promiseArray.push(promise);
        }
        Promise.all(promiseArray);
    }

    public prepareChatDataFromRawData(rawData: any): Array<any> {
        let timeStampKeys = Object.keys(rawData);
        let messageArray = [];
        let myData = this.localStorageService.getFromSession("user");
        for(let keysIndex=0; keysIndex<timeStampKeys.length; keysIndex++) {
            let rawMessage = rawData[timeStampKeys[keysIndex]];
            let firebaseKeys = Object.keys(rawMessage);
            for(let fbKeyIndex=0; fbKeyIndex<firebaseKeys.length; fbKeyIndex++) {
                let messageChunk = rawMessage[firebaseKeys[fbKeyIndex]];

                let newMessageObject: any;
                newMessageObject = {};
                newMessageObject.text = messageChunk.message;
                newMessageObject.time = this.common.getTimeFromTimeStamp(messageChunk.senton);
                if(messageChunk.to === myData.phoneNumber) {
                    newMessageObject.receiveOrSentText = "receiver";
                } else {
                    newMessageObject.receiveOrSentText = "sender";
                }
                messageArray.push(newMessageObject);
            }
        }
        return messageArray;
      }

    public sendMessageFileWork(messageObject: Message) {
        let fileName = this.getChatFilePrefix()+"-"+messageObject.to;
        this.fileHandler.checkIfFileExists(fileName).then((value)=>{
            let data = JSON.parse(value);
            data[Date.now()] = messageObject;
            this.fileHandler.writeFile(JSON.stringify(data), fileName).then(() => {
                this.event.publish("MESSAGE-UPDATED", fileName);             
            }).catch(() => {});
        }).catch(() => {
            let data = {};
            data[Date.now()] = messageObject;
            this.fileHandler.writeFile(JSON.stringify(data), fileName).then(() => {
                this.event.publish("MESSAGE-UPDATED", fileName);
            }).catch(() => {});
        });
    }

    public sendMessage(messageObject: Message) {
        // writing to my database
        return new Promise((resolve, reject) => {
            this.database.writeMessageToDatabase("/"+messageObject.to+"/chat/"+messageObject.from, messageObject).then(() => {
                this.sendMessageFileWork(messageObject);
                //resolve();                
            }).catch(() => {
                reject();
            });
        });
        
    }

    private ddmmyyToTimeStamp(ddmmyy: string) {
        let array = [];
        array = ddmmyy.split("-");
        let newDate=array[1]+"/"+array[0]+"/"+array[2];
        return (new Date(newDate).getTime());
    }

    private sortFileNameArrayDateWise(fileNameArray: Array<string>):Array<string> {
        for(let index1=0; index1<fileNameArray.length; index1++) {
            let fileNameTempArray = fileNameArray[index1].split("-");
            fileNameTempArray.pop();
            let timeStamp1 = this.ddmmyyToTimeStamp(fileNameTempArray.join("-"));
            for(let index2=index1+1; index2<fileNameArray.length; index2++) {
                fileNameTempArray = fileNameArray[index2].split("-");
                fileNameTempArray.pop();
                let timeStamp2 = this.ddmmyyToTimeStamp(fileNameTempArray.join("-"));
                if(timeStamp1<timeStamp2) {
                    let tempFileName = fileNameArray[index1];
                    fileNameArray[index1] = fileNameArray[index2];
                    fileNameArray[index2] = tempFileName;
                }
            }
        }
        return fileNameArray;
    }

    private getConversationFileNameLists(phoneNumber: string) {
        return new Promise((resolve, reject) => {
            let fileNameArray = [];
            this.fileHandler.getDirectoryContents().then((value) => {
               for(let index=0; index< value.length; index++) {
                   if(value[index].isFile) {
                       if(value[index].name.indexOf(phoneNumber) !== -1 ) {
                        fileNameArray.push(value[index].name);
                       }
                   }
               }
               fileNameArray = this.sortFileNameArrayDateWise(fileNameArray);
               resolve(fileNameArray);
            }).catch(() => {
                resolve(fileNameArray);
            });
        });
        
    }

    public getConversationData(phoneNumber: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getConversationFileNameLists(phoneNumber).then((fileNameList) => {
                if(JSON.stringify(fileNameList) === "[]") {
                    reject();
                }
                else {
                    this.localStorageService.setInSession("conversation-file-name-list", JSON.stringify(fileNameList));
                    let fileName = fileNameList[0];
                    this.fileHandler.readFileContent(fileName).then((data)=>{
                        //returning data from latest chat file
                        resolve(JSON.parse(data));
                    }).catch(() => {
                        reject();
                    });    
                }
            }).catch(() => {
                reject();
            });
        });
        
    }

    
}