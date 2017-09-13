import {Injectable} from '@angular/core';
import { Events } from 'ionic-angular';
import { Platform } from 'ionic-angular';

@Injectable()
export class LocalStorageService {
    public keyList;
    constructor() {
        this.keyList = [
            "user"
        ];
    }

    public setInSession(key: string, data: string): boolean {
        if(this.keyList.indexOf(key) === -1) {
            return false;
        } else {
            try{
                localStorage[key] = data;
            } catch(exception) {
                return false;
            }
        }
    }

    public getFromSession(key: string): any {
        if(typeof localStorage[key] === undefined) {
            return null;
        } else {
            return JSON.parse(localStorage[key]);
        }
    }

}