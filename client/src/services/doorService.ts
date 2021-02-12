import config from '../config/config';

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
    return fetch(`${config.BASE_URL}/entity/${id}`)
        .then((x) => x.json());
}
