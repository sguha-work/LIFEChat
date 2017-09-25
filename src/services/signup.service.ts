import {Injectable} from '@angular/core';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

@Injectable()
export class SignupService {
    constructor(private uniqueDeviceID: UniqueDeviceID) {
        
    }

    getDeviceID(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.uniqueDeviceID.get().then((uuid: any) => {
                resolve(uuid);
            }).catch((error: any) => {
                reject();
            });
        });
    }
}