import axios from 'axios';
import config from '../config/config';

class HttpForwarder {

    get<T>(url: string): Promise<T> {
        return axios.get(`http://${config.baseUrl}${url}`);
    }

    post<T>(url: string, data: any, header?: any): Promise<T> {
        return axios.post(`http://${config.baseUrl}${url}`, data, header);
    }

}

export default new HttpForwarder();
