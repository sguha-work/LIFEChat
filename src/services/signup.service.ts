import {Injectable} from '@angular/core';
import { Events } from 'ionic-angular';
import {Database} from './database.service';
import {MessageService} from './message.service';
import {User} from './../interfaces/user.interface';
@Injectable()
export class SignUpService {
    constructor(private database: Database, private message: MessageService) {
        
    }

    storeUserDataToDatabase(userObject: User): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.writeToDatabase(userObject.phoneNumber, userObject).then(() => {
                resolve();
            }).catch(() => {
                reject(this.message.getMessage("UNABLE_TO_CONTACT_DATABASE"));
            });
        });
    }
    checkIfUserExists(phoneNumber: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.getFromDatabase(phoneNumber).then((value) => {
                if(value===null) {
                    resolve(false);
                } else {
                    resolve(this.message.getMessage("USER_ALREADY_EXISTS"));
                }
            }).catch(() => {
                reject(this.message.getMessage("UNABLE_TO_CONTACT_DATABASE"));
            });
        });
    }
}