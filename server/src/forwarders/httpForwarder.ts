import axios, { AxiosRequestConfig } from 'axios';
import config from '../config/config';

class HttpForwarder {

    setToken(token: string) {
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

    async delete<T>(url: string, conf?: any): Promise<T> {
        return (await axios.delete(`http://${config.baseUrl}${url}`, conf)).data;
    }

    async patch<T>(url: string, conf?: any): Promise<T> {
        return (await axios.patch(`http://${config.baseUrl}${url}`, conf)).data;
    }

}

export default new HttpForwarder();
