import config from '../config/config';

export interface LampData {
    name: string;
    id: string;
    state: string;
    type: string;
    message?: string;
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
    return fetch(`${config.BASE_URL}/entity/${id}`)
        .then((x) => {
            if (!x.ok) {
                throw Error('');
            }
            return x.json();
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

export async function switchLamp(id: string, brightnessPct?: number): Promise<any> {
    // If brightness is provided, then turn on, else, turn it off
    console.log(brightnessPct);
    const body = JSON.stringify(
        brightnessPct
            ? {
                service: 'light.turn_on',
                serviceData: {
                    brightness_pct: brightnessPct,
                },
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

export async function changeLampRGB(id: string, r: number, g: number, b: number): Promise<any> {
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
