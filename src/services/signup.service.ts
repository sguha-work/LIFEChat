import {Injectable} from '@angular/core';

import {Database} from './database.service';
import {User} from "./../interfaces/user.interface";
import {CommonService} from "./common.service";
import {ErrorService} from "./error.service";

@Injectable()
export class SignupService {

    constructor(private database: Database, private common: CommonService, private error: ErrorService) {
        
    }

    private validate(phoneNumber: string, emailId: string, password: string) {
        
    }

    public isUserExists(phoneNumber: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.getFromDatabase(phoneNumber).then((value) => {
                if(value !== null) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch(() => {
                reject();
            });
        });
        
    }

    

    public signUp(phoneNumber: string, password: string, email: string, image?: string): Promise<any> {
        let userObject: any;
        userObject = {};

        return new Promise((resolve, reject) => {
            if(this.validate(phoneNumber, email, password)) {
                this.isUserExists(phoneNumber).then((result) => {
                    if(result) {
                        reject(this.error.errorMessage.USER_ALREADY_EXISTS);
                    } else {

                    }
                }).catch(() => {
                    reject(this.error.errorMessage.UNABLE_TO_CONNECT_TO_DATABASE.en);
                });
                userObject.phoneNumber = phoneNumber;
                userObject.email = email;
                userObject.password = this.common.encryptPassword(password);
                userObject.lastSeen = Date.now();
            } else {
                reject(this.error.errorMessage.INVALID_INPUT);
            }
        });
    }
}