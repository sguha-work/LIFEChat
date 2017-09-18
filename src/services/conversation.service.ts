import { Inject, Injectable } from "@angular/core";
import { FirebaseApp } from "angularfire2";
import * as firebase from 'firebase';
import { Events } from 'ionic-angular';

import {Database} from './database.service';
import {Message} from './../interfaces/message.interface';
import {FileHandler} from './fileHandler.service';

@Injectable()
export class ConversationService {

    private _messaging: firebase.messaging.Messaging;

    constructor(@Inject(FirebaseApp) private _firebaseApp: firebase.app.App, private database: Database, private fileHandler: FileHandler, private event: Events) {
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
        for(let index=0; index<keys.length; index++) {
            let promise = new Promise((resolve, reject) => {
                let fileName = this.getChatFilePrefix()+"-"+keys[index];alert(fileName);
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
                    }).catch(() => {});
                });
            });
            promiseArray.push(promise);
        }
        Promise.all(promiseArray);
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

    private getConversationFileNameLists(phoneNumber: string) {
        return new Promise((resolve, reject) => {
            let fileNameArray = [];
            this.fileHandler.getDirectoryContents().then((value) => {
               for(let index=0; index< value.length; index++) {
                   if(value[index].isFile) {
                       if(value[index].name.indexOf("phoneNumber") !== -1 ) {
                        fileNameArray.push(value[index].name);
                       }
                   }
               }
               resolve(fileNameArray);
            }).catch(() => {
                resolve(fileNameArray);
            });
        });
        
    }

    public getConversationData(phoneNumber: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getConversationFileNameLists(phoneNumber).then((list) => {
                
            }).catch(() => {

            });
        });
        
    }

    
}