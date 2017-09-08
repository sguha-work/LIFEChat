import {Injectable} from '@angular/core';
import { Events } from 'ionic-angular';

@Injectable()
export class LanguageService {
    constructor() {

    }
    public getPresentLanguage(): string {
        return "en";
    }
}