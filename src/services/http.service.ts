import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

const dataFilePath = "assets/data/";

@Injectable()
export class HTTPService {
    constructor(private http: Http) {

    }

    public getData(dataFileName: string): Promise<any>{
        return new Promise((resolve, reject) => {
            this.http.get(dataFilePath+dataFileName).toPromise().then((data) => {
                resolve(data);
            }).catch(() => {
                reject();
            });
        });
    }

    public get(url: string, options?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(url, options).toPromise().then((response) => {
                resolve(response);
            }).catch(() => {
                reject(null);
            });
        });
    }
}