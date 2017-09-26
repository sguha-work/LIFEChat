import {Injectable} from '@angular/core';
import { Events } from 'ionic-angular';

import {FileService} from './file.service';
import {Database} from './database.service';
import {User} from "./../interfaces/user.interface";

@Injectable()
export class LoginService {
    constructor(private fileService: FileService, private database: Database, private events: Events) {

    }

    public isLoggedIn(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.fileService.checkIfFileExists("user").then((userValue) => {
                let user = JSON.parse(userValue);
                user.lastSeen = Date.now();
                this.updateUserStatus(user.phoneNumber, user);
                this.fileService.writeFile(JSON.stringify(user), "user");
                resolve(userValue);
            }).catch(() => {
                reject();
            });
        });
        
    }

    public createLocalLoginEntry(user: User): Promise<any> {
        return new Promise((resolve, reject) => {
            this.fileService.writeFile(JSON.stringify(user), "user").then(() => {
                resolve();
            }).catch(() => {
                reject();
            });
        });
        
    }

    public loginUser(phoneNumber: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.getFromDatabase(phoneNumber).then((value) => {
                resolve(value);
            }).catch(() => {
                reject();
            });
        });
    }

    public updateUserStatus(phoneNumber: string, data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.events.publish("USER_UPDATED");
            this.database.updateToDatabase(phoneNumber, data).then(() => {
                resolve();
            }).catch(() => {
                reject();
            });
        });
    }
}