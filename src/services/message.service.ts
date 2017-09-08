import { File } from '@ionic-native/file';
import {Injectable} from '@angular/core';
import { Events } from 'ionic-angular';
import {LanguageService} from "./language.service";
import {MessageData} from "./data/message.data";
@Injectable()
export class MessageService {
    private messageData;
    constructor(private language: LanguageService) {
        this.messageData = new MessageData();
    }

    getMessage(messageKey: string): string {
        let appLanguage = this.language.getPresentLanguage();
        return MessageData.data[messageKey][appLanguage];
    }
}