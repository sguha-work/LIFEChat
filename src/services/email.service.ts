import {Injectable} from '@angular/core';
import { EmailComposer } from '@ionic-native/email-composer';
@Injectable()
export class EmailService {
    
    private email: string;
    
    constructor(private emailComposer: EmailComposer) {
        this.email = "sguha1988.life@gmail.com";
    }

    public openSendMailWindow(subject: string,body: string,email?: string) {
        if(subject.trim() === "") {
            subject = "Forgot password of LIFE";
        }
        email = "sguha1988.life@gmail.com";

        let mail = {
            to: email,
            cc: '',
            bcc: [''],
            attachments: [],
            subject: subject,
            body: body,
            isHtml: true
          };
        this.emailComposer.open(mail);
    }
}