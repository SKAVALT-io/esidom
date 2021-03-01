import http from '../../utils/HttpHelper';
import { tr } from '../../utils/i18nHelper';
import toastService from '../../utils/toast';

export async function updateLight(id: string, serviceData: {[id: string]: unknown}): Promise<void> {
    return http.put<void, {service: string, serviceData: {[id: string]: unknown}}>(`/entity/${id}`, {
        service: 'light.turn_on',
        serviceData,
    }).catch((err) => {
        toastService.toast(tr('entities.errorWhileToggle'), 'error');
        throw err;
    });
}

export async function changeBrightness(id: string, brightnessPct: number): Promise<void> {
    return updateLight(id, {
        brightness_pct: brightnessPct,
    });
}

export async function changeLampRGB(id: string, r: number, g: number, b: number): Promise<void> {
    return updateLight(id, {
        rgb_color: [r, g, b],
    });
}

export async function switchLamp(id: string, switchOn: boolean): Promise<unknown> {
    return http.put(`/entity/${id}`, {
        service: (switchOn ? 'light.turn_on' : 'light.turn_off'),
    }).catch((err) => {
        toastService.toast(tr('entities.errorWhileToggle'), 'error');
        throw err;
    });
}
