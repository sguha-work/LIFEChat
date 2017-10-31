import {Injectable} from '@angular/core';

@Injectable()
export class MessageService {
    public messages = {
        "UNABLE_TO_CONNECT_TO_DATABASE": {
            "en": "Cannot connect to databse"
        },
        "USER_ALREADY_EXISTS": {
            "en": "User already exists"
        },
        "INVALID_INPUT": {
            "en": "Provided data is not supported"
        }
    };
}