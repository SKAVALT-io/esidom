import { Request, Response } from 'express';
import axios from 'axios';

class HttpForwarder {

    get<T>(url: string): Promise<T> {
        return new Promise((res, rej) => {});
    }

    post<T>(): Promise<T> {
        return new Promise((res, rej) => {});
    }

}

export default new HttpForwarder();
