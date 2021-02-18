import config from '../../config/config';
import type { LightEntity } from '../../../types/entities/lightEntity';

export function componentToHex(c: number): string {
    const hex = c.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
}

export function rgbToHex(r: number, g: number, b: number): string {
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

export async function updateLight(id: string, serviceData: {[id: string]: string}): Promise<void> {
    const body = JSON.stringify({
        service: 'light.turn_on',
        serviceData,
    });

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    fetch(`${config.BASE_URL}/entity/${id}`, {
        headers,
        method: 'PUT',
        body,
    });
}

export async function changeBrightness(id: string, brightnessPct: number): Promise<void> {
    const body = JSON.stringify({
        service: 'light.turn_on',
        serviceData: {
            brightness_pct: brightnessPct,
        },
    });

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    fetch(`${config.BASE_URL}/entity/${id}`, {
        headers,
        method: 'PUT',
        body,
    });
}

export async function switchLamp(id: string, switchOn: boolean): Promise<unknown> {
    const body = JSON.stringify(
        switchOn
            ? {
                service: 'light.turn_on',
            } : {
                service: 'light.turn_off',
            },
    );
    console.log(body);
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    return fetch(`${config.BASE_URL}/entity/${id}`, {
        headers,
        method: 'PUT',
        body,
    });
}

export async function changeLampRGB(id: string, r: number, g: number, b: number): Promise<void> {
    const body = JSON.stringify({
        service: 'light.turn_on',
        serviceData: {
            rgb_color: [r, g, b],
        },
    });

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    fetch(`${config.BASE_URL}/entity/${id}`, {
        headers,
        method: 'PUT',
        body,
    });
}
