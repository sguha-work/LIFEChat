import {Injectable} from '@angular/core';
import { Events } from 'ionic-angular';
import {Database} from './database.service';
import {MessageService} from './message.service';
import {User} from './../interfaces/user.interface';
@Injectable()
export class LogInService {
    constructor(private database: Database, private message: MessageService) {
        
    }

    loginUser(userObject: User): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.writeToDatabase(userObject.phoneNumber, userObject).then(() => {
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