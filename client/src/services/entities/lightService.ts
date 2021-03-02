import http from '../../utils/HttpHelper';
import { tr } from '../../utils/i18nHelper';
import toastService from '../../utils/toast';

/**
 * Updates a light.
 * @param id the entity id of the light
 * @param serviceData the data to update the light
 */
export async function updateLight(id: string, serviceData: {[id: string]: unknown}): Promise<void> {
    return http.put<void, {service: string, serviceData: {[id: string]: unknown}}>(`/entity/${id}`, {
        service: 'light.turn_on',
        serviceData,
    }).catch((err) => {
        toastService.toast(tr('entities.errorWhileToggle'), 'error');
        throw err;
    });
}

/**
 * Changes the brightness of a light.
 * @param id the entity id of the light
 * @param brightnessPct the new brightness
 */
export async function changeBrightness(id: string, brightnessPct: number): Promise<void> {
    return updateLight(id, {
        brightness_pct: brightnessPct,
    });
}

/**
 * Changes the color of a light.
 * @param id the entity id of the light
 * @param r the red color beetween 0 and 255
 * @param g the green color beetween 0 and 255
 * @param b the blue color beetween 0 and 255
 */
export async function changeLampRGB(id: string, r: number, g: number, b: number): Promise<void> {
    return updateLight(id, {
        rgb_color: [r, g, b],
    });
}

/**
 * Switch the light states.
 * @param id the entity id of the light
 * @param switchOn do we switch on the light?
 */
export async function switchLamp(id: string, switchOn: boolean): Promise<unknown> {
    return http.put(`/entity/${id}`, {
        service: (switchOn ? 'light.turn_on' : 'light.turn_off'),
    }).catch((err) => {
        toastService.toast(tr('entities.errorWhileToggle'), 'error');
        throw err;
    });
}
