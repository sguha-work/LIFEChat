import {Injectable} from '@angular/core';
import { Contacts} from '@ionic-native/contacts';
//import { SocialSharing } from '@ionic-native/social-sharing';

import {FileService} from './file.service';
import {Database} from './database.service';
import {MessageService} from "./message.service";

const PhoneContactListFile = "contacts";
const LIFEContactListFile = "life-contacts";

@Injectable()
export class ContactService { 

    constructor(private file: FileService, private contacts: Contacts, private message: MessageService, private database: Database) {
        
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

    private readLIFEContactsFromDatabase(userPhoneNumber: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getPhoneContacts(userPhoneNumber).then((contactList) => {
                let promiseArray = [];
                let lifeContactsArray = [];
                for(let index=0; index<contactList.length; index++) {
                    let promise = new Promise((resolve, reject) => {
                        this.database.getFromDatabase(contactList[index].phoneNumber).then((lifeObject) => {
                            if(lifeObject != null) {
                                lifeObject.name = contactList[index].name;
                                lifeContactsArray.push(lifeObject);
                            }
                            resolve();
                        }).catch(() => {
                            resolve();
                        });
                    });
                    promiseArray.push(promise);
                }

                Promise.all(promiseArray).then(() => {
                    resolve(lifeContactsArray);
                }).catch(() => {
                    resolve(lifeContactsArray)
                });
            }).catch(() => {
                reject(this.message.messages.UNABLE_TO_READ_CONTACTS_FROM_DATABASE.en);
            });
        });
    }

    public getPhoneContacts(userPhoneNumber: string): Promise<any> {

        return new Promise((resolve, reject) => {
            this.file.readFile(PhoneContactListFile).then((dataFromFile) => {
                resolve(JSON.parse(dataFromFile));
            }).catch(() => {
                // file not found creating
                this.readPhoneContactList(userPhoneNumber).then((contactsList) => {
                    this.file.writeFile(JSON.stringify(contactsList), PhoneContactListFile).then(() => {
                        resolve(contactsList);
                    }).catch(() => {
                        resolve(contactsList);
                    });
                    
                }).catch(() => {
                    // reading contacts failed so rejecting
                    reject(this.message.messages.UNABLE_TO_READ_CONTACTS_FROM_PHONE.en);
                });
            });
        });
        
    }

    public getLIFEContacts(userPhoneNumber: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.file.readFile(LIFEContactListFile).then(((lifeContactsData)=>{
                resolve(JSON.parse(lifeContactsData));
            })).catch(() => {
                this.readLIFEContactsFromDatabase(userPhoneNumber).then((lifeContacts) => {
                    this.file.writeFile(JSON.stringify(lifeContacts), LIFEContactListFile).then(() => {
                        resolve(lifeContacts);
                    }).catch(() => {
                        resolve(lifeContacts);
                    });
                }).catch(() => {
                    reject(this.message.messages.UNABLE_TO_READ_CONTACTS_FROM_DATABASE.en);
                });
            });
            
        });
    }

    public refreshPhoneContactList(userPhoneNumber: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.readPhoneContactList(userPhoneNumber).then((contactsList) => {
                this.file.writeFile(JSON.stringify(contactsList), PhoneContactListFile).then(() => {
                    resolve(contactsList);
                }).catch(() => {
                    resolve(contactsList);
                });
            }).catch(() => {
                reject(this.message.messages.UNABLE_TO_READ_CONTACTS_FROM_PHONE.en);
            });
        });
    }

    public refreshLIFEContactList(userPhoneNumber: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.refreshPhoneContactList(userPhoneNumber).then(() => {
                this.readLIFEContactsFromDatabase(userPhoneNumber).then((lifeContacts) => {
                    resolve(lifeContacts);
                }).catch(() => {
                    reject(this.message.messages.UNABLE_TO_READ_CONTACTS_FROM_DATABASE.en);
                });
            }).catch(() => {
                reject(this.message.messages.UNABLE_TO_READ_CONTACTS_FROM_PHONE.en);
            });
        });
    }
}