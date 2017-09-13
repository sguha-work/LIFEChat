import {Injectable} from '@angular/core';
import { Events } from 'ionic-angular';
import {Database} from './database.service';
import {MessageService} from './message.service';
import {User} from './../interfaces/user.interface';
import {LocalStorageService} from './localStorage.service';
//import {FileHandler} from './fileHandler.service';
import { Platform } from 'ionic-angular';

@Injectable()
export class LogInService {
    constructor(private database: Database, private message: MessageService, private platform: Platform, private ls: LocalStorageService) {
        
    }

    public prepareLocalLoginFile(userObject: User): Promise<any> {
        return new Promise((resolve, reject) => {
            this.ls.setInSession("user", JSON.stringify(userObject));
        });
        
    }

    public checkIfLocalLoginFileExists(): Promise<any> {
        return new Promise((resolve, reject) => {
            if(this.ls.getFromSession("user") !== null) {
                resolve(JSON.parse(localStorage["user"]) as User);
            } else {
                reject();
            }
        });
    }

    loginUser(userObject: User): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.writeToDatabase(userObject.phoneNumber, userObject).then(() => {
                this.prepareLocalLoginFile(userObject);
                resolve();
            }).catch(() => {
                reject(this.message.getMessage("UNABLE_TO_CONTACT_DATABASE"));
            });
        });
    }

    public getUserObject(phoneNumber: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.getFromDatabase(phoneNumber).then((value) => {
                if(value!==null) {
                    resolve(value as User);
                } else {
                    reject(this.message.getMessage("PHONENUMBER_NOT_FOUND"));
                }
            }).catch(() => {
                reject(this.message.getMessage("UNABLE_TO_CONTACT_DATABASE"));
            });
        });
    }

    public checkIfUserExists(phoneNumber: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.getFromDatabase(phoneNumber).then((value) => {
                if(value===null) {
                    resolve(this.message.getMessage("USER_ALREADY_EXISTS"));
                } else {
                    reject();
                }
            }).catch(() => {
                reject(this.message.getMessage("UNABLE_TO_CONTACT_DATABASE"));
            });
        });
    }
}