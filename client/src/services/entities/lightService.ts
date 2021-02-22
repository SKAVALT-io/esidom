import http from '../../utils/HttpHelper';

export async function updateLight(id: string, serviceData: {[id: string]: string}): Promise<void> {
    return http.put(`/entity/${id}`, {
        service: 'light.turn_on',
        serviceData,
    });
}

export async function changeBrightness(id: string, brightnessPct: number): Promise<void> {
    return http.put(`/entity/${id}`, {
        service: 'light.turn_on',
        serviceData: {
            brightness_pct: brightnessPct,
        },
    });
}

export async function switchLamp(id: string, switchOn: boolean): Promise<unknown> {
    return http.put(`/entity/${id}`, {
        service: (switchOn ? 'light.turn_on' : 'light.turn_off'),
    });
}

export async function changeLampRGB(id: string, r: number, g: number, b: number): Promise<void> {
    return http.put(`/entity/${id}`, {
        service: 'light.turn_on',
        serviceData: {
            rgb_color: [r, g, b],
        },
    });
}
