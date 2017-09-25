import {Injectable} from '@angular/core';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

@Injectable()
export class CommonService {

    constructor(private uniqueDeviceID: UniqueDeviceID) {

    }

    public validatePhoneNumber(phoneNumber: string): boolean {
        if(isNaN(parseInt(phoneNumber))) {
            return false;
        }
        if(phoneNumber.length !== 10) {
            return false;
        }
        return true;
    }

    public validatePassword(password: string): boolean {
        if(password.length < 5) {
            return false;
        }
        return true;
    }

    public validateEmail(email: string): boolean {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    public getDeviceID(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.uniqueDeviceID.get().then((uuid: any) => {
                resolve(uuid);
            }).catch((error: any) => {
                reject();
            });
        });
    }
}