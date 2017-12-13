import {Injectable} from '@angular/core';

import {Database} from './database.service';
import {User} from "./../interfaces/user.interface";
import {MessageService} from "./message.service";
import {FileService} from "./file.service";

const userFileName = "user";

@Injectable()
export class LoginService {
    constructor(private database: Database, private messageService: MessageService, private file: FileService) {

    }

    public login(phoneNumber: string, password: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.getFromDatabase(phoneNumber).then((data) => {
                if(data !== null) {
                    let userData: User;
                    userData = data;
                    if(btoa(password)===userData.password) {
                        this.file.writeFile(JSON.stringify(userData), userFileName).then(() => {
                            // writing data to local file done
                            resolve();
                        }).catch(() => {
                            // writing to local file failed
                            
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

    public isLoogedIn(): Promise<any> {
        return new Promise(( resolve, reject) => {
            this.file.checkIfFileExists(userFileName).then((dataFromFile) => {
                resolve(dataFromFile);
            }).catch(() => {
                reject();
            });
        });
    }
}