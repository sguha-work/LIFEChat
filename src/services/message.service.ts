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
        },
        "IMAGE_NOT_SUPPORTED": {
            "en": "Only JPEG, PNG image supported"
        },
        "IMAGE_UPLOAD_FAILED": {
            "en": "Failed to upload image probably due to network issue. Try again Latter."
        },
        "SIGN_UP_SUCCESS": {
            "en": "Congratulation! you are in LIFE now. Go to login page for logging in"
        },
        "PASSWORD_MISSMATCH": {
            "en": "Wrong password"
        },
        "No_USER_FOUND": {
            "en": "Provided user doesn't exists"
        },
        "UNABLE_TO_READ_CONTACTS_FROM_PHONE": {
            "en": "Can't read phone contacts"
        },
        "UNABLE_TO_READ_CONTACTS_FROM_DATABASE": {
            "en": "Can't read LIFE contacts"
        }
    };
}