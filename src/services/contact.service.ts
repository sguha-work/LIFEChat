import {Injectable} from '@angular/core';
import { Events } from 'ionic-angular';
import { Contacts} from '@ionic-native/contacts';
import { SocialSharing } from '@ionic-native/social-sharing';

import {Database} from './database.service';
import {FileService} from './file.service';
import {User} from './../interfaces/user.interface';

@Injectable()
export class ContactService {
    constructor(private file: FileService, private contacts: Contacts, private socialSharing: SocialSharing, private database: Database) {

    }

    private createLocalBackupForContacts(contactsArray: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.file.writeFile(JSON.stringify(contactsArray), "contacts").then(() => {
                resolve();
            }).catch(() => {
                reject();
            });
        });
    }

    private getListOfLIFEAccount(phoneContacts: any): Promise<any> {
        let lifeContactsArray = [];
        return new Promise((resolve, reject) => {
            let promiseArray = [];
            for(let phoneContactIndex=0; phoneContactIndex<phoneContacts.length; phoneContactIndex++) {
                let promiseObject = new Promise((res, rej) => {
                    this.database.getFromDatabase(phoneContacts[phoneContactIndex].phoneNumber).then((dataFromDatabase) => {
                        if(dataFromDatabase === null) {
                            res();
                        } else {
                            let imageName = "image_"+dataFromDatabase.phoneNumber
                            this.file.writeFile(dataFromDatabase.image, imageName).then(() => {
                                dataFromDatabase.image = imageName;
                                lifeContactsArray.push(dataFromDatabase);
                                res();
                            }).catch(() => {
                                dataFromDatabase.image = "";
                                lifeContactsArray.push(dataFromDatabase);
                                res();
                            });
                            
                        }
                    }).catch(() => {
                        res();
                    });                    
                });
                promiseArray.push(promiseObject);
            }
            Promise.all(promiseArray).then(() => {
                resolve(lifeContactsArray);
            }).catch(() => {
                // unable to refresh LIFE contacts
                reject();
            });
        });
    }

    private createLocalBackupForLIFEContacts(lifeContactsArray: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.file.writeFile(JSON.stringify(lifeContactsArray), "LIFEcontacts").then(() => {
                resolve();
            }).catch(() => {
                reject();
            });
        });
    }

    public getLIFEContacts(phoneNumber: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.file.checkIfFileExists("LIFEcontacts").then((dataFromFile) => {
                resolve(JSON.parse(dataFromFile));
            }).catch(() => {
                // no local life contacts file so creating
                this.refreshLIFEContacts(phoneNumber).then((lifeContacts) => {
                    resolve(lifeContacts);
                }).catch(() => {
                    reject();
                });
            });
        });
        
    }

    public refreshLIFEContacts(phoneNumber: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.refreshPhoneContactList(phoneNumber).then((phoneContacts) => {
                this.getListOfLIFEAccount(phoneContacts).then((lifeContactsArray) => {
                    this.createLocalBackupForLIFEContacts(lifeContactsArray).then(()=>{
                        // resolving with localbackup
                        resolve(lifeContactsArray);
                    }).catch(() => {
                        // resolving without local backup
                        resolve(lifeContactsArray);
                    });
                }).catch(() => {
                    reject();
                });
            }).catch(() => {
                // unable to refresh contacts
            });
        });
        
    }

    public refreshPhoneContactList(phoneNumber): Promise<any> {
        return new Promise((resolve, reject) => {
            this.readPhoneContactList(phoneNumber).then((contactsArray) => {
                this.createLocalBackupForContacts(contactsArray).then(() => {
                    // resolving after local backup is done
                    resolve(contactsArray);
                }).catch(() => {
                    // resolving without creating local backup
                    resolve(contactsArray);
                });
                
            }).catch(() => {
                reject();
            });
        });
    }

    public getPhoneContacts(phoneNumber: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.file.checkIfFileExists("contacts").then((value) => {
                let contactList = JSON.parse(value);
                resolve(contactList);
            }).catch(() => {
                this.readPhoneContactList(phoneNumber).then((contactsArray) => {
                    this.createLocalBackupForContacts(contactsArray);
                    resolve(contactsArray);
                }).catch(() => {
                    reject();
                });
            });
        });
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
    public shareLIFEChat(phoneNumber: string, name: string) {
        //if(confirm("Want to share LIFEChat to "+name+"?")) {
          this.socialSharing.share("You are invited to LIFEChat, a new fresh simple chat application, click link to download ", null, null, "https://drive.google.com/drive/folders/0B7H8-Q6hAIvNdFNmZUxYSlRGZTA?usp=sharing"); 
        //}
      }
}