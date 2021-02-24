import http from '../../utils/HttpHelper';

export async function turnOn(id: string): Promise<unknown> {
    return http.put(`/entity/${id}`, {
        service: 'homeassistant.turn_on',
    });
}

export async function toggle(id: string): Promise<unknown> {
    return http.put(`/entity/${id}`, {
        service: 'homeassistant.toggle',
    });
}

export async function turnOff(id: string): Promise<unknown> {
    return http.put(`/entity/${id}`, {
        service: 'homeassistant.turn_off',
    });
}
