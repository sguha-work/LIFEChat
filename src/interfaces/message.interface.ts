export interface Message {
    from: string;
    to: string;
    message: string;
    senton: number;
    deliverredon: number;
    readon: number;
    status: number; // 0-waiting to be delivered, 1- delivered, 2-sent, 3-read
}