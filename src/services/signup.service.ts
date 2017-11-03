import {Injectable} from '@angular/core';

import {Database} from './database.service';
import {User} from "./../interfaces/user.interface";
import {CommonService} from "./common.service";
import {MessageService} from "./message.service";
import {StorageService} from "./storage.service";

@Injectable()
export class SignupService {

    constructor(private database: Database, private common: CommonService, private messageService: MessageService, private storage: StorageService) {
        
    }

    private writeUserToDatabase(userObject: User): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.writeToDatabase(userObject.phoneNumber, userObject).then(() => {
                resolve();
            }).catch(() => {
                reject(this.messageService.messages.UNABLE_TO_CONNECT_TO_DATABASE.en);
            });
        });
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
                reject(this.messageService.messages.UNABLE_TO_CONNECT_TO_DATABASE.en);
            });
        });
        
    }

    

    public signUp(phoneNumber: string, password: string, email: string, image?: any): Promise<any> {
        let userObject: any;
        userObject = {};

        return new Promise((resolve, reject) => {
           this.isUserExists(phoneNumber).then((result) => {
                if(result) {
                    reject(this.messageService.messages.USER_ALREADY_EXISTS.en);
                } else {
                    userObject.phoneNumber = phoneNumber;
                    userObject.email = email;
                    userObject.password = this.common.encryptPassword(password);
                    userObject.lastSeen = Date.now();
                    if(typeof image !== "undefined" && image !== "") {
                        this.storage.uploadFile(image, phoneNumber).then((image) => {
                            userObject.image = image.downloadURL;
                            this.writeUserToDatabase(userObject).then(() => {
                                resolve(this.messageService.messages.SIGN_UP_SUCCESS.en);
                            }).catch(() => {
                                reject(this.messageService.messages.UNABLE_TO_CONNECT_TO_DATABASE.en);
                            });
                        }).catch(() => {
                            reject(this.messageService.messages.IMAGE_UPLOAD_FAILED.en);
                        });
                    }
                    else {
                        this.writeUserToDatabase(userObject).then(() => {
                            resolve(this.messageService.messages.SIGN_UP_SUCCESS.en);
                        }).catch(() => {
                            reject(this.messageService.messages.UNABLE_TO_CONNECT_TO_DATABASE.en);
                        });
                    }
                    
                }
            }).catch(() => {
                reject(this.messageService.messages.UNABLE_TO_CONNECT_TO_DATABASE.en);
            });
        });
    }
}