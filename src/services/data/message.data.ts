const data = `{
    "CANT_READ_PHONE_NUMBER": {
        "en": "Cannot read the phone number.",
        "hin": "फ़ोन नंबर पढ़ नहीं सकते"
    },
    "NO_INTERNET_CONNECTION": {
        "en": "Please check your internet connection.",
        "hin": "कृपया अपने इंटरनेट कनेक्शन की जाँच करें।"
    },
    "UNABLE_TO_DELIVER_MESSEGE": {
        "en": "Unable to deliver messege. Please try after sometime.",
        "hin": "संदेश वितरित करने में असमर्थ, कृपया कुछ देर बाद प्रयास करें।"
    },
    "SIM_READ_PERMISSION_DENIED": {
        "en": "You denied reading SIM information, cannot start application.",
        "hin": ""
    },
    "UNABLE_TO_GET_SIM_INFO": {
        "en": "Unable to read SIM information cannot start application.",
        "hin": ""
    },
    "NO_SIM_IN_DEVICE": {
        "en": "No SIM card detected in device, Unable to start application",
        "hin": ""
    },
    "UNABLE_TO_READ_FILE": {
        "en": "Can't read file",
        "hin": ""
    },
    "UNABLE_TO_DETECT_SIM": {
        "en": "Unable to detect SIM card, app cannot be loaded",
        "hin": ""
    },
    "PHONENUMBER_NOT_FOUND": {
        "en": "Provided phone number is not registerd to our database",
        "hin": ""
    },
    "UNABLE_TO_CONTACT_DATABASE": {
        "en": "Cannot connec to database now. Please try latter",
        "hin": ""
    },
    "PHONENUMBER_PASSWORD_MISMATCH": {
        "en": "Password mismatch with given phonenumber",
        "hin": ""
    },
    "SIGN_UP_SUCCESS": {
        "en": "Sign up successfull. Click Ok to go to sign in page",
        "hin": ""
    },
    "USER_ALREADY_EXISTS": {
        "en": "The provided phone number already exists in database, want to login?",
        "hin": ""
    }
}`;
export class MessageData {
    public static data: any;
    constructor() {
        MessageData.data = JSON.parse(data);
    }
}