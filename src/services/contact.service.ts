import {Injectable} from '@angular/core';
import { Contacts} from '@ionic-native/contacts';
import { SocialSharing } from '@ionic-native/social-sharing';

import {Database} from './database.service';
import {FileService} from './file.service';
import {MessageService} from "./message.service";
@Injectable()
export class ContactService { 

    constructor(private file: FileService, private contacts: Contacts, private socialSharing: SocialSharing, private database: Database, private message: MessageService) {
        
    }
    private readPhoneContactList(userPhoneNumber: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let contactsArray = [];
            let tempPhoneArray = [];
            this.contacts.find(["displayName"], {filter:"",multiple: true,desiredFields:["displayNames", "phoneNumbers"],hasPhoneNumber: true}).then((contacts) => {
                if(contacts.length) {
                    for(let contactIndex=0; contactIndex<contacts.length; contactIndex++) {
                        for(let index=0; index<contacts[contactIndex]["_objectInstance"].phoneNumbers.length; index++) {
                            let phoneNumber = contacts[contactIndex]["_objectInstance"].phoneNumbers[index].value;
                            phoneNumber = phoneNumber.split(" ").join("").split("-").join("");
                            if(phoneNumber.length > 10) {
                                phoneNumber = phoneNumber.slice(-10);
                            }
                            if(phoneNumber.length === 10 && tempPhoneArray.indexOf(phoneNumber) === -1 && (phoneNumber[0]==="9" || phoneNumber[0]==="8" || phoneNumber[0]==="7") && typeof contacts[contactIndex]["_objectInstance"].displayName !== "undefined" && contacts[contactIndex]["_objectInstance"].displayName !== null) {
                                if(phoneNumber !== userPhoneNumber) {
                                    contactsArray.push({
                                        name: contacts[contactIndex]["_objectInstance"].displayName,
                                        phoneNumber: phoneNumber
                                    });
                                    tempPhoneArray.push(phoneNumber);
                                }
                            }
                        }
                    }
                }
                resolve(contactsArray);
              }, (error) => {
                resolve(contactsArray);
              });
        });
        
    
    }
    public getPhoneContacts(): Promise<any> {

        return new Promise((resolve, reject) => {
            this.file.readFile("contacts").then().catch(() => {
                // file not found creating
                this.getPhoneContacts().then((contactsList) => {
                    this.file.writeFile(JSON.stringify(contactsList), "contacts");
                    resolve(contactsList);
                }).catch(() => {
                    // reading contacts failed so rejecting
                    reject(this.message.messages.UNABLE_TO_READ_CONTACTS_FROM_PHONE.en);
                });
            });
        });
        
    }
    public getLIFEContacts(): Promise<any> {
        return new Promise((resolve, reject) => {

        });
    }
}