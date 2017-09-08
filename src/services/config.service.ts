import {Injectable} from '@angular/core';
import { Events } from 'ionic-angular';
import {FileHandler} from "./fileHandler.service";
import {LanguageService} from "./language.service";
//import {SimService} from "./sim.service";


@Injectable()
export class ConfigService {
    constructor(private file: FileHandler, private language: LanguageService) {

    }
    private getDeviceDefaultLanguage(): string {
        return this.language.getPresentLanguage();
    }
    private prepareConfigObject(): Promise<any> {
        let configObject: any;
        configObject = {};
        return new Promise((resolve, reject) => {
            // this.getPhoneNumberFromSim().then((phoneNumberData) => {
                
                // preparing initial config object
                configObject.phoneNumbers = "";
                configObject.defaultPhoneNumber = "";
                configObject.deviceId = "";
                configObject.applicationLanguage = this.getDeviceDefaultLanguage();
                configObject.userloggedin = false;
                configObject.userPhoneNumber = "";
                configObject.userPassword = "";
                // initial config object prepared

                resolve(configObject);
            // }).catch((message) => {
            //     reject(message);
            // });
        });
    }

    // private getPhoneNumberFromSim(): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         this.sim.requestReadPermission().then(() => {
    //             this.sim.getPhoneNumbers().then((phoneNumbersData) => {
    //                 // phone numbers collected
    //                 resolve(phoneNumbersData);
    //             }).catch((message) => {
    //                 // can't read phone number from sim
    //                 reject(message);
    //             });
    //         }).catch((message) => {
    //             // read permission denied
    //             reject(message);
    //         });
    //     });
    // }

    private writeConfigData(configData): Promise<any> {
        return new Promise((resolve, reject) => {

            this.file.writeFile(JSON.stringify(configData), "config").then(() => {
                // config file write done
                resolve();
            }).catch(() => {
                // config file writing failed
                reject();
            });
        });
    }

    public updateAfterLogIn(logInData: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getInformation().then((data) => {
                //alert("data "+JSON.stringify(data));
                let parsedData = data;
                parsedData.userloggedin = true;
                parsedData.phoneNumber = logInData.phoneNumber;
                parsedData.password = logInData.password;
                this.file.writeFile(JSON.stringify(parsedData), "config").then(() => {}).catch(() => {
                    alert("Unable to write data");
                });
            }).catch((message) => {
                reject(message);
            });
        });
    }

    public prepareAndWriteInitialConfigData(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.prepareConfigObject().then((configObject) => {
                this.writeConfigData(configObject).then(() => {
                    // config write done
                    
                    resolve();
                }).catch((message) => {
                    // config write failed
                    reject(message);
                });
            }).catch((message) => {
                reject(message);
            });
        });
    }

    public checkIfConfigFileExists(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.file.checkIfFileExists("config").then((value) => {
               resolve();
            }).catch(() => {
                reject();
            });
        });
        
    }
    public createConfigFolder(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.file.createDirectory("config").then(() => {
                resolve();
            }).catch(() => {
                reject();
            });
        });
    }
    public createDataFolder(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.file.createDirectory("data").then(() => {
                resolve();
            }).catch(() => {
                reject();
            });
        });
    }

    public getInformation(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.file.readFileContent("config").then((data) => {
                resolve(JSON.parse(data));
            }).catch((message) => {
                reject(message);
            });
        });
        
    }
}