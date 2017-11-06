import {Injectable} from '@angular/core';

import {Database} from './database.service';
import {User} from "./../interfaces/user.interface";
import {MessageService} from "./message.service";
import {FileService} from "./file.service";

@Injectable()
export class LoginService {
    constructor(private database: Database, private messageService: MessageService, private file: FileService) {

    }

    login(phoneNumber: string, password: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.getFromDatabase(phoneNumber).then((data) => {
                if(data !== null) {
                    let userData: User;
                    userData = data;
                    if(btoa(password)===userData.password) {alert(JSON.stringify(userData));
                        this.file.writeFile(JSON.stringify(userData), "user").then(() => {
                            alert("writing done");
                            resolve();
                        }).catch(() => {
                            alert("writing failed");
                        });
                        
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