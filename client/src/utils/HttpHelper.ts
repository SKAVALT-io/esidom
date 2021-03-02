import axios from 'axios';
import config from '../config/config';

class Http {
    private http = axios.create({
        baseURL: config.API_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    async get<T>(url: string): Promise<T> {
        return this.http.get<T>(url)
            .then((x) => x.data);
    }

    async post<T, U>(url: string, data?: U): Promise<T> {
        return this.http.post<T>(url, data)
            .then((x) => x.data);
    }

    async put<T, U>(url: string, data?: U): Promise<T> {
        return this.http.put<T>(url, data)
            .then((x) => x.data);
    }

    async patch<T, U>(url: string, data?: U): Promise<T> {
        return this.http.patch<T>(url, data)
            .then((x) => x.data);
    }

    async delete<T, U>(url: string, data?: U): Promise<T> {
        return this.http.delete<T>(url, data)
            .then((x) => x.data);
    }
}

export default new Http();
