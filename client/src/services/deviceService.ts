import type { Protocols } from '../../types/protocols';
import type { Device } from '../../types/deviceType';
import http from '../utils/HttpHelper';

export default class DeviceService {
    // eslint-disable-next-line import/prefer-default-export
    static async launchPair(): Promise<Protocols> {
        return http.post('/device');
    }

    static async getDevices(): Promise<Device[]> {
        return http.get('/device');
    }
}
