import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Events } from 'ionic-angular';

@Injectable()
export class Database {
   constructor(private db: AngularFireDatabase, private events: Events) {
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
        this.db.database.ref("/"+key).push(data,(error) => {
            if(error) {
                alert("failed");
                reject();
            } else {
                alert("messege to databse");
                resolve();
            }
        })
       });
       
   }

   public receiveConversation(senderPhoneNumber: string, myPhoneNumber: string) {
        let starCountRef = this.db.database.ref('/' + myPhoneNumber + '/chat/'+senderPhoneNumber);
        starCountRef.on('value', (snapshot) => {
            this.events.publish("MESSAGE-RECEIVED", snapshot.val());
        });
   }
   
}