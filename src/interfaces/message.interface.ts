export interface Message {
    from: string;
    to: string;
    message: string;
    isFile: string;
    senton: number;
    deliverredon?: number;
    sentFromDevice?: string;
}