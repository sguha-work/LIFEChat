import {Injectable} from '@angular/core';

import {Database} from './database.service';
import {User} from "./../interfaces/user.interface";
import {CommonService} from "./common.service";
import {MessageService} from "./message.service";
import {StorageService} from "./storage.service";

@Injectable()
export class LoginService {
    constructor(private database: Database, private common: CommonService, private messageService: MessageService, private storage: StorageService) {

    }

    login(phoneNumber: string, password: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.getFromDatabase(phoneNumber).then((data) => {
                if(data !== null) {
                    let userData: User;
                    userData = data;
                    if(atob(password)===userData.password) {
                        resolve();
                    } else {
                        reject(this.messageService.messages.PASSWORD_MISSMATCH.en);
                    }
                } else {
                    reject(this.messageService.messages.No_USER_FOUND.en);
                }
            }).catch(() => {
                reject(this.messageService.messages.UNABLE_TO_CONNECT_TO_DATABASE.en);
            });
        });
    }
}