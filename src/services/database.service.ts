import {Injectable} from '@angular/core';
//import { AngularFireDatabase } from 'angularfire2/database';
import { Events } from 'ionic-angular';

declare var firebase;
//firebase.database()
@Injectable()
export class Database {
    private db: any;
    constructor(private events: Events) {
        this.db = firebase.database();
    }

    public writeToDatabase(key: string, data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.database.ref('/'+key).set(data).then(() => {
                resolve();
            }).catch((error) => {
                reject();
            });
       });
    }

    public updateToDatabase(key: string, data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.database.ref('/'+key).update(data).then(() => {
                resolve();
            }).catch((error) => {
                reject();
            });
       });
    }

    public getFromDatabase(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.database.ref('/'+key).once('value').then((data) => {
                resolve(data.val());
            }).catch((error) => {
                reject(error);
            });
        });
    }

   public writeMessageToDatabase(key: string, data: any) {
       return new Promise((resolve, reject) => {
        this.db.database.ref("/chat/"+key).push(data,(error) => {
            if(error) {
                alert("Failed to deliver the message");
                reject();
            } else {
                resolve();
            }
        })
       });
       
   }

   public turnOnConversationConnection(myPhoneNumber: string) {
        let databaseReference = this.db.database.ref('/' + '/chat/' + myPhoneNumber + '/');
        databaseReference.on('value', (snapshot) => {
            this.events.publish("MESSAGES-RECEIVED", snapshot.val());
        });
   }

   public deleteChat(myPhoneNumber: string) {
    let databaseReference = this.db.database.ref('/' + myPhoneNumber + '/chat/');
    databaseReference.remove(() => {
        // deleted from database
    });
   }
   
}