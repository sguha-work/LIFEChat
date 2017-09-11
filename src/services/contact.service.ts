import {Injectable} from '@angular/core';
import { Events } from 'ionic-angular';
import {Database} from './database.service';
import {MessageService} from './message.service';
import {User} from './../interfaces/user.interface';
import { Contacts} from '@ionic-native/contacts';
import { Platform } from 'ionic-angular';

@Injectable()
export class ContactService {
    constructor(private database: Database, private message: MessageService, private platform: Platform, private contacts: Contacts) {
        
    }

    public getContactList(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.contacts.find(["displayName"], {filter:"",multiple: true,desiredFields:["displayNames", "phoneNumbers"],hasPhoneNumber: true}).then((contacts) => {
                let contactsArray = [];
                if(contacts.length) {
                    for(let contactIndex=0; contactIndex<contacts.length; contactIndex++) {
                        
                        //if(contacts[contactIndex]["_objectInstance"].phoneNumbers.length > 1) {
                            for(let index=0; index<contacts[contactIndex]["_objectInstance"].phoneNumbers.length; index++) {
                                let phoneNumber = contacts[contactIndex]["_objectInstance"].phoneNumbers[index].value;
                                if(phoneNumber.length > 10) {
                                    phoneNumber = phoneNumber.slice(-10);
                                }
                                if(phoneNumber.length === 10) {
                                    contactsArray.push({
                                        name: contacts[contactIndex]["_objectInstance"].displayName,
                                        phoneNumber: phoneNumber
                                    });
                                }
                                
                            }
                        //}
                        // contactsArray.push({
                        //     name: contacts[contactIndex]["_objectInstance"].displayName,
                        //     phoneNumber: phoneNumber
                        // });

                    }
                }
                // if(contacts.length) {
                //     for(let index=0; index<contacts.length; index++) {
                //         let userName = typeof contacts[index]["_objectInstance"].displayName !== "undefined"?contacts[index]["_objectInstance"].displayName:"";
                //         if(userName !== "") {
                //             if(typeof contacts[index]["_objectInstance"].phoneNumbers !== "undefined") {
                //                 let phoneNumbers = contacts[index]["_objectInstance"].phoneNumbers;
                //                 if(phoneNumbers.length && typeof phoneNumbers[0].value !== "undefined" && phoneNumbers[0].value !== "") {
                //                     for(let index2=0; index2<phoneNumbers.length; index2++) {
                //                         if(typeof phoneNumbers[index2] !== "undefined" && phoneNumbers[index2] !== "") {
                //                             contactsArray.push({
                //                                 name: userName,
                //                                 phoneNumber: phoneNumbers[index2].value
                //                             });
                //                         }
                                        
                //                     }
                //                 }
                //             }
                //         }
                //     }
                // }
                
                alert(JSON.stringify(contactsArray));
                resolve(contacts);
              }, (error) => {
                alert("error");
              });
        });
        
    }
}