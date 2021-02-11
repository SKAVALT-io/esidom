/* eslint-disable camelcase */
import config from '../config/config';

const baseUrl = `http://${config.MIDDLE_URL}:${config.MIDDLE_PORT}`;

export interface TemperatureData {
    name: string;
    id: string,
    state: string;
    attributes: {
        unit_of_measurement: string;
    };
}

export async function getTemp(id: string): Promise<TemperatureData> {
    return fetch(`${baseUrl}/entity/${id}`)
        .then((x) => x.json());
}
