import axios from 'axios';
import config from '../config/config';

class HttpForwarder {

    private token: string = '';

    setToken(token: string) {
        this.token = token;
        axios.interceptors.request.use((conf) => {
            // eslint-disable-next-line no-param-reassign
            conf.headers.Authorization = `Bearer ${token}`;
            return conf;
        });
    }

    get<T>(url: string): Promise<T> {
        return axios.get(`http://${config.baseUrl}${url}`);
    }

    post<T>(url: string, data: any, conf?: any): Promise<T> {
        return axios.post(`http://${config.baseUrl}${url}`, data, conf);
    }

}

export default new HttpForwarder();
