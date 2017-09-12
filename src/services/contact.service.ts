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

    public checkIfContactExistsInDatabase(): Promise<any> {
        return new Promise((resolve, reject) => {
            
        });
    }

    private getTimeFromTimeStamp(timeStamp) {
        let date = new Date(timeStamp);
        let year    = date.getFullYear();
        let month   = date.getMonth()+1;
        let day     = date.getDate();
        let hour    = date.getHours().toString();
        let minute  = date.getMinutes();
        let seconds = date.getSeconds();
        if(parseInt(hour)>12) {
            hour = (parseInt(hour) - 12).toString()+":"+minute+":"+seconds+" PM";
        } else {
            if(hour === "00") {
                hour = "12";
            }
            hour = hour+":"+minute+":"+seconds+" AM";
        }
         
        return day+"-"+month+"-"+year+" "+hour+" "+minute+":"+seconds;
    }

    public isALIFEMember(phoneNumber: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.getFromDatabase(phoneNumber).then((value) => {
                if(value === null) {
                    resolve(false);
                } else {
                    if(value.lastseen) {
                       value.lastseen = this.getTimeFromTimeStamp(value.lastseen);
                    }
                    resolve(value)
                }
            }).catch(() => {
                reject();
            });
        });
    }

    public getContactList(): Promise<any> {
        let contactsArray = [];
        let tempPhoneArray = [];
        // contactsArray.push({
        //     name: "Admin",
        //     phoneNumber: 9830612244,
        //     isOnLIFEChat: true,
        //     lifeObject: {}
        // });
        return new Promise((resolve, reject) => {
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
                resolve(contactsArray);
              }, (error) => {
                resolve(contactsArray);
              });
        });
        
    }
}