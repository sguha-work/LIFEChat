import {Injectable} from '@angular/core';
import { Events } from 'ionic-angular';
import * as $ from 'jquery';

@Injectable()
export class CommonService {
    
    public showPage(pageName: string): void {
        let pageArray = [
            "page-contacts",
            "page-conversation",
            "page-login",
            "page-signup"
        ];

        for(let index=0; index<pageArray.length; index++) {
            if(pageArray[index] === pageName) {
                $(pageArray[index]).show();
            } else {
                $(pageArray[index]).hide();
            }
        }

    }
}