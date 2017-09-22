import {Injectable} from '@angular/core';

import {FileService} from './file.service';

@Injectable()
export class LoginService {
    constructor(private fileService: FileService) {

    }

    public isLoggedIn(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.fileService.checkIfFileExists("user").then(() => {
                resolve();
            }).catch(() => {
                reject();
            });
        });
        
    }
}