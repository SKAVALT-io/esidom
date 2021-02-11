/* eslint-disable camelcase */
import config from '../config/config';

export interface TemperatureData {
    name: string;
    id: string,
    state: string;
    attributes: {
        unit_of_measurement: string;
    };
}

export async function getTemp(id: string): Promise<TemperatureData> {
    return fetch(`${config.BASE_URL}/entity/${id}`)
        .then((x) => x.json());
}
