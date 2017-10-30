import {Injectable} from '@angular/core';
import {Database} from './database.service';
import {User} from "./../interfaces/user.interface";

@Injectable()
export class SignupService {

    constructor(private database: Database) {
        
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

    

    public signUp(phoneNumber: string, password: string, email: string, image?: string) {
        let userObject: User;
        //userObject = {};
        if(this.validate())
        userObject.phoneNumber = phoneNumber
                
    }
}