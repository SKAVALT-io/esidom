import axios from 'axios';
import config from '../config/config';

class Http {
    private http = axios.create({
        baseURL: config.BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    async get<T>(url: string): Promise<T> {
        return (await this.http.get<T>(url)).data;
    }

    async post<T, U>(url: string, data?: U): Promise<T> {
        return (await this.http.post<T>(url, data)).data;
    }

    async put<T, U>(url: string, data?: U): Promise<T> {
        return (await this.http.put<T>(url, data)).data;
    }

    async patch<T, U>(url: string, data?: U): Promise<T> {
        return (await this.http.patch<T>(url, data)).data;
    }

    async delete<T, U>(url: string, data?: U): Promise<T> {
        return (await this.http.delete<T>(url, data)).data;
    }
}

export default new Http();
