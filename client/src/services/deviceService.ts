import type { Protocols } from '../../types/protocols';
import http from '../utils/HttpHelper';

export default class DeviceService {
    // eslint-disable-next-line import/prefer-default-export
    static async launchPair(): Promise<Protocols> {
        return http.post('/device');
    }
}
