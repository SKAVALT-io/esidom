import type { Protocols } from '../../types/protocols';
import type { Device } from '../../types/deviceType';
import http from '../utils/HttpHelper';
import toastService from '../utils/toast';
import { tr } from '../utils/i18nHelper';

export default class DeviceService {
    /**
     * Starts pairing process.
     */
    static async launchPair(): Promise<Protocols> {
        return http.post<Protocols, undefined>('/device')
            .catch((err) => {
                toastService.toast(tr('pairing.errorWhileLaunchingPairing'), 'error');
                throw err;
            });
    }

    /**
     * Gets the devices.
     */
    static async getDevices(): Promise<Device[]> {
        return http.get<Device[]>('/device')
            .catch((err) => {
                toastService.toast(tr(tr('devices.errorWhileLoading')), 'error');
                throw err;
            });
    }
}
