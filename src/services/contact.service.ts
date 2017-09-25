import {Injectable} from '@angular/core';
import { Events } from 'ionic-angular';
import { Contacts} from '@ionic-native/contacts';

import {Database} from './database.service';
import {FileService} from './file.service';
import {User} from './../interfaces/user.interface';

@Injectable()
export class ContactService {
    constructor(private file: FileService, private contacts: Contacts) {

    }

    public createLocalBackupForContacts(contactsArray: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.file.writeFile(JSON.stringify(contactsArray), "contacts").then(() => {
                resolve();
            }).catch(() => {
                reject();
            });
        });
    }

    public getContacts(phoneNumber: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.file.checkIfFileExists("contacts").then((value) => {
                let contactList = JSON.parse(value);
                resolve(contactList);
            }).catch(() => {
                this.refreshContactList(phoneNumber).then((contactsArray) => {
                    this.createLocalBackupForContacts(contactsArray);
                    resolve(contactsArray);
                }).catch(() => {
                    reject();
                });
            });
        });
    }

    public refreshContactList(userPhoneNumber: string): Promise<any> {
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
                            if(phoneNumber.length === 10 && tempPhoneArray.indexOf(phoneNumber) === -1 && typeof contacts[contactIndex]["_objectInstance"].displayName !== "undefined" && contacts[contactIndex]["_objectInstance"].displayName !== null) {
                                if(phoneNumber !== userPhoneNumber) {
                                    contactsArray.push({
                                        name: contacts[contactIndex]["_objectInstance"].displayName,
                                        phoneNumber: phoneNumber,
                                        isOnLIFEChat: false,
                                        lifeObject: {}
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
}