import axios, { AxiosRequestConfig } from 'axios';
import { logger } from '../utils';
import config from '../config/config';

class HttpForwarder {

    private interceptorId: number = -1;

    setToken(token: string) {
        this.interceptorId = axios.interceptors.request.use((conf) => ({
            ...conf,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }));
        logger.debug(this.interceptorId);
    }

    removeToken() {
        logger.info('Removing existing token');
        axios.interceptors.request.eject(this.interceptorId);
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

}

export default new HttpForwarder();
