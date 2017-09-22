import {Injectable} from '@angular/core';
import { File } from '@ionic-native/file';
import {Platform} from 'ionic-angular';

const rootFolderName = "LIFEChat"

@Injectable()
export class FileService {
    constructor(private file: File, private platform: Platform) {
        this.checkAndCreateInitialDirectories().then((prepareMessageData) => {
            this.prepareMessageData();
        }).catch(() => {
            alert("Unable to create initial files. Exiting app");
            this.platform.exitApp();;
        });
        
    }

    private checkAndCreateInitialDirectories(): Promise<any> {
        let prepareMessageData = false;
        return new Promise((resolve, reject) => {
            this.file.checkDir(this.file.dataDirectory, rootFolderName).then(() => {
                // root directory exists
                resolve(prepareMessageData);
            }).catch(() => {
                // root directory doesnot exists, so creating
                this.file.createDir(this.file.dataDirectory, rootFolderName, false).then(() => {
                    // root directory created successfully
                    prepareMessageData = true;
                    resolve(prepareMessageData);
                }).catch(() => {
                    // root directory creation failed
                    reject();
                    
                });
            });
        });
        
    }

    private prepareMessageData() {
        alert("prepare message data");
    }

    private getPath() {
        return this.file.dataDirectory+"/"+rootFolderName;
    }

    public checkIfFileExists(fileName): Promise<any> {
        return new Promise((resolve, reject) => {
            this.file.checkFile(this.getPath(), fileName).then((response) => {
                if(response) {
                    resolve();
                } else {
                    reject();
                }
            }).catch(() => {
                reject();
            });
        });
        
    }
}