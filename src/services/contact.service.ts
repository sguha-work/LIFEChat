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
                                        phoneNumber: phoneNumber,
                                        isOnLIFEChat: false,
                                        lifeObject: {}
                                    });
                                }
                                
                            }
                    }
                }
                resolve(contactsArray);
              }, (error) => {
                alert("error");
              });
        });
        
    }
}