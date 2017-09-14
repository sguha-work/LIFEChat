import { Inject, Injectable } from "@angular/core";
import { FirebaseApp } from "angularfire2";
import * as firebase from 'firebase';

import {Database} from './database.service';
import {Message} from './../interfaces/message.interface';

@Injectable()
export class ConversationService {

    private _messaging: firebase.messaging.Messaging;

    constructor(@Inject(FirebaseApp) private _firebaseApp: firebase.app.App, private database: Database) {
        //this._messaging = firebase.messaging(this._firebaseApp);
        //this._messaging.requestPermission().then(() => {}).catch((error) => {});
    }

    public sendMessage(messageObject: Message) {
        // writing to my database
        return new Promise((resolve, reject) => {
            // this.database.writeMessageToDatabase("/"+messageObject.from+"/chat/"+messageObject.to, messageObject).then(() => {
                
            // }).catch(() => {
            //     reject();
            // });
            // writing to receiver's database
            this.database.writeMessageToDatabase("/"+messageObject.to+"/chat/"+messageObject.from, messageObject).then(() => {
                resolve();                
            }).catch(() => {
                reject();
            });
        });
        
    }

    public invokeReadConnection(senderPhoneNumber: string, myPhoneNumber: string) {
        this.database.receiveConversation(senderPhoneNumber, myPhoneNumber);
    }
}