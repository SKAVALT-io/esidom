import config from '../config/config';

const baseUrl = `http://${config.MIDDLE_URL}:${config.MIDDLE_PORT}`;

export interface DoorData {
    name: string;
    id: string;
    state: string;
    type: string;
    attributes: {
        contact: boolean;
    };
}

export async function getDoor(id: string): Promise<DoorData> {
    return fetch(`${baseUrl}/entity/${id}`)
        .then((x) => x.json());
}
