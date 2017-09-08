import {Injectable} from '@angular/core';
import { Events } from 'ionic-angular';
//import {FileHandler} from "./fileHandler.service";
import {LanguageService} from "./language.service";


@Injectable()
export class ConfigService {
    constructor(private language: LanguageService) {

    }
    
}