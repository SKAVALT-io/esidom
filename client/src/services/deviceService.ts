import type { Protocols } from '../../types/protocols';
import type { Device } from '../../types/deviceType';
import http from '../utils/HttpHelper';
import toastService from '../utils/toast';
import { tr } from '../utils/i18nHelper';

export default class DeviceService {
    static async launchPair(): Promise<Protocols> {
        return http.post<Protocols, undefined>('/device')
            .then((p) => p)
            .catch(() => {
                toastService.toast(tr('pairing.errorWhileLaunchingPairing'), 'error');
                return {};
            });
    }

    static async getDevices(): Promise<Device[]> {
        return http.get<Device[]>('/device')
            .then((d) => d)
            .catch(() => {
                toastService.toast(tr(tr('devices.errorWhileLoading')), 'error');
                return [];
            });
    }
}
