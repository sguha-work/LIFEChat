import {Injectable} from '@angular/core';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { AndroidPermissions } from '@ionic-native/android-permissions';

import {Database} from './database.service';
import {User} from "./../interfaces/user.interface";
@Injectable()
export class SignupService {
    constructor(private uniqueDeviceID: UniqueDeviceID, private androidPermissions: AndroidPermissions, private database: Database) {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA);
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

    public writeUserDataToDatabase(user: User): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.writeToDatabase(user.phoneNumber, user).then(() => {
                resolve();
            }).catch(() => {
                reject();
            });
        });
    }

}