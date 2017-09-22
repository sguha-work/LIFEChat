import { AlertController } from 'ionic-angular';
import {Injectable} from '@angular/core';

@Injectable()
export class AlertService {
    constructor(private alertCtrl: AlertController) {

    }

    public showAlert(message: string, title?: string) {
        if(typeof title === "undefined") {
            title = "";
        }
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: "message",
            buttons: ['Dismiss']
        });
        alert.present();
    }
}