import { File } from '@ionic-native/file';
import {Injectable} from '@angular/core';
import { Events } from 'ionic-angular';
import {MessageService} from './message.service';

const rootFolderName = "SMSPlus";
@Injectable()
export class FileHandler {
    
    constructor(private file: File,private event: Events, private message: MessageService) {
        this.checkAndCreateDirectory()
    }

    private checkAndCreateDirectory() {
        this.file.checkDir(this.file.dataDirectory, rootFolderName).then(() => {

        }).catch(() => {
            this.file.createDir(this.file.dataDirectory, rootFolderName, false);
        });
    }

    private getDirectoryPath(): string {
        return this.file.dataDirectory + "/" + rootFolderName;
    }

    public checkIfDirectoryExists(directoryName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let directoryPath = this.getDirectoryPath();
            this.file.checkDir(directoryPath, directoryName).then(() => {
                resolve(true);
            }).catch(() => {
                resolve(false);
                reject();
            });
        });
    }

    public checkIfFileExists(fileName: string): Promise<any> {
        let directoryPath = this.getDirectoryPath();
        //directoryPath += ("/"+folderName);
        return new Promise((resolve, reject) => {
            this.file.readAsText(directoryPath, fileName).then(() => {
                resolve();
            }).catch(() => {
                reject();
            });
        });
    }

    public createDirectory(directoryName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let directoryPath = this.getDirectoryPath();
            this.checkIfDirectoryExists(directoryName).then(() => {
                resolve();
            }).catch(() => {
                this.file.createDir(directoryPath, directoryName, false).then(() => {
                    resolve();
                }).catch(() => {
                    reject();
                });
            });
            
        });
    }

    public writeFile(data: string, fileName: string): Promise<any> {
        let directoryPath = this.getDirectoryPath();
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
                }).catch(() => {
                    reject();
                });
            });
        });
    }

    public readFileContent(fileName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.file.readAsText(this.getDirectoryPath(), fileName).then((data) => {
                resolve(data);
            }).catch(() => {
                reject(this.message.getMessage("UNABLE_TO_READ_FILE"));
            });
        });
    }
   
}