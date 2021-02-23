import axios, { AxiosRequestConfig } from 'axios';
import config from '../config/config';

class HttpForwarder {

    private token: string = '';

    setToken(token: string) {
        this.token = token;
        axios.interceptors.request.use((conf) => ({
            ...conf,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }));
    }

    async get<T>(url: string, conf?: AxiosRequestConfig): Promise<T> {
        return (await axios.get(`http://${config.baseUrl}${url}`, conf)).data;
    }

    async post<T>(url: string, data: any, conf?: any): Promise<T> {
        return (await axios.post(`http://${config.baseUrl}${url}`, data, conf)).data;
    }

}

export default new HttpForwarder();
