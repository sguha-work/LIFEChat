import {Injectable} from '@angular/core';

declare var firebase;

@Injectable()
export class StorageService {
    private storage;
    constructor() {
        this.storage = firebase.storage().ref();
    }

    public uploadFile(fileData: any, fileName: string): Promise<any> {
        //let childRef = this.storage.child(fileData);
        let fileRef = this.storage.child(fileName);
        return new Promise((resolve, reject) => {
            fileRef.putString(fileData, 'data_url').then((snapshot) => {
                resolve(snapshot);
            }).catch(() => {
                reject();
            });
        });
        
    }
}