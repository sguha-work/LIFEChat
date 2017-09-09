export interface Chat {
    from: string;
    to: string;
    message: string;
    senton: number;
    deliverredon: number;
    readon: number;
    isDeliverred: boolean;
}