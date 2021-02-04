import axios from 'axios';

class HttpForwarder {

    get<T>(url: string): Promise<T> {
        return axios.get(url);
    }

    post<T>(url: string, data: any): Promise<T> {
        return axios.post(url, data);
    }

}

export default new HttpForwarder();
