import {Injectable} from '@angular/core';
import { Sim } from '@ionic-native/sim';
import {MessageService} from './message.service';

@Injectable()
export class SimService {
   constructor(private sim: Sim, private message: MessageService) {
   }

   public getPhoneNumbers(): Promise<any> {
       let phoneNumberArray;
       phoneNumberArray = [];
       return new Promise((resolve, reject) => {
        this.sim.getSimInfo().then((info) => {
                if(info.phoneNumber.toString() === "") {
                    if((info.cards[0].phoneNumber).toString().trim() === "") {
                        reject(this.message.getMessage("UNABLE_TO_DETECT_SIM"));
                    }
                    phoneNumberArray.push(info.cards[0].phoneNumber);
                    if(!phoneNumberArray.length) {
                        reject(this.message.getMessage("NO_SIM_IN_DEVICE"));
                    }
                    resolve(phoneNumberArray);
                } else {
                    phoneNumberArray.push(info.phoneNumber);
                    resolve(phoneNumberArray);
                }
            }).catch(() => {
                reject(this.message.getMessage("UNABLE_TO_GET_SIM_INFO"));
            });
       });
       
   }

   public requestReadPermission(): Promise<any> {
    return new Promise((resolve, reject) => {
            this.sim.requestReadPermission().then(() => {
                resolve();
            }).catch(() => {
                reject(this.message.getMessage("SIM_READ_PERMISSION_DENIED"));
            });
    });
    
   }
}