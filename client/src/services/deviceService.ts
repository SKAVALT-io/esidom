import http from '../utils/HttpHelper';

export default class DeviceService {
    // eslint-disable-next-line import/prefer-default-export
    static async launchPair(): Promise<void> {
        return http.post('/device');
    }
}
