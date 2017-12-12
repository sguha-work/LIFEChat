import {Injectable} from '@angular/core';
import { File } from '@ionic-native/file';
import { Platform } from 'ionic-angular';

const rootFolderName = "LIFEChat";

@Injectable()
export class FileService {
    constructor(private file: File, private platform: Platform) {
        // this.checkAndCreateInitialDirectories().then((prepareMessageData) => {
            
        // }).catch(() => {
        //     this.platform.exitApp();;
        // });
        this.checkAndSetPlatform();   
    }
    
    private checkAndSetPlatform() {
        if (this.platform.is('browser')) {
            localStorage.platform = "browser";
        } else {
            localStorage.platform = "ionic";
        }
    }

    public checkAndCreateInitialDirectories(): Promise<any> {
        let prepareMessageData = false;
        return new Promise((resolve, reject) => {
            if(localStorage.platform === "browser") {
                if(typeof localStorage.rootFolderName === "undefined") {
                    localStorage.rootFolderName = "{}";
                }
                resolve();
            } else {
                this.file.checkDir(this.file.dataDirectory, rootFolderName).then(() => {
                // root directory exists
                resolve(prepareMessageData);
                }).catch(() => {
                    // root directory doesnot exists, so creating
                    this.file.createDir(this.file.dataDirectory, rootFolderName, false).then(() => {
                        // root directory created successfully
                        prepareMessageData = true;
                        resolve(prepareMessageData);
                    }).catch((message) => {
                        // root directory creation failed
                        reject();
                        
                    });
                });    
            }
            
        });
        
    }

    private getPath() {
        return this.file.dataDirectory+"/"+rootFolderName;
    }

    public readFile(fileName): Promise<any> {
        return new Promise((resolve, reject) => {
            if(localStorage.platform === "browser") {
                if(typeof localStorage[rootFolderName][fileName] === "undefined") {
                    reject();
                } else {
                    resolve(localStorage[rootFolderName][fileName]);
                }
            } else {
                this.file.readAsText(this.getPath(), fileName).then((value) => {
                    resolve(value);
                }).catch(() => {
                    reject();
                });    
            }
            
        });
        
    }

    public checkIfFileExists(fileName): Promise<any> {
        return new Promise((resolve, reject) => {
            this.file.readAsText(this.getPath(), fileName).then((value) => {
                resolve(value);
            }).catch(() => {
                reject();
            });
        });
        
    }

    public getAllChatFile(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.file.listDir(this.file.dataDirectory, rootFolderName).then((value) => {
                let chatFileList = [];
                for(let fileIndex=0; fileIndex<value.length; fileIndex++) {
                    if(value[fileIndex].isFile && !value[fileIndex].isDirectory && (value[fileIndex].name.indexOf(".chat")!== -1)) {
                        chatFileList.push(value[fileIndex].name);
                    }
                }
                resolve(chatFileList);
            }).catch(() => {
                reject();
            });
        });
    }

    public writeFile(data: string, fileName: string): Promise<any> {
        let directoryPath = this.getPath();
        return new Promise((resolve, reject) => {
            this.checkIfFileExists(fileName).then(() => {
                // file already exists, rewriting
                this.file.writeExistingFile(directoryPath, fileName, data).then(() => {
                    resolve();
                }).catch(() => {
                    reject();
                });
            }).catch(() => {
                // file doesn't exists writing
                this.file.writeFile(directoryPath, fileName, data).then(() => {
                    resolve();
                }).catch((error) => {
                    reject();
                });
            });
        });
    }

    
}