export interface User {
    phoneNumber: string;
    password: string;
    email: string;
    loggedInDeviceId?: string;
    lastLogIn?: number;// timestamp
    lastSeen?: number;// timestamp
    group?: any;
    image?: any;
}