import config from '../config/config';

const baseUrl = `http://${config.MIDDLE_URL}:${config.MIDDLE_PORT}`;

export interface LampData {
    name: string;
    id: string;
    state: string;
    type: string;
    attributes: {
        // eslint-disable-next-line camelcase
        rgb_color: number[];
        brightness: number;
    };
}

export function componentToHex(c: number): string {
    const hex = c.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
}

export function rgbToHex(r: number, g: number, b: number): string {
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

export async function getLamp(id: string): Promise<LampData> {
    return fetch(`${baseUrl}/entity/${id}`)
        .then((x) => x.json());
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
    fetch(`${baseUrl}/entity/${id}`, {
        headers,
        method: 'PUT',
        body,
    });
}

export async function switchLamp(id: string, brightnessPct?: number): Promise<any> {
    const body = JSON.stringify(
        brightnessPct
            ? {
                service: 'light.turn_off',
            }
            : {
                service: 'light.turn_on',
                serviceData: {
                    brightness_pct: brightnessPct,
                },
            },
    );
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    return fetch(`${baseUrl}/entity/${id}`, {
        headers,
        method: 'PUT',
        body,
    });
}

export async function changeLampRGB(id: string, r: number, g: number, b: number): Promise<any> {
    const body = JSON.stringify({
        service: 'light.turn_on',
        serviceData: {
            rgb_color: [r, g, b],
        },
    });

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    fetch(`${baseUrl}/entity/${id}`, {
        headers,
        method: 'PUT',
        body,
    });
}
