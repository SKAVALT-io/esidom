import type { Entity } from '../../types/entityType';
import type { Service } from '../../types/serviceType';
import config from '../config/config';

export async function getEntity<T>(id: string): Promise<T> {
    return fetch(`${config.BASE_URL}/entity/${id}`)
        .then((x) => {
            if (!x.ok) {
                throw Error('');
            }
            return x.json();
        });
}

export const actualDomains = ['binary_sensor', 'switch', 'sensor', 'light'];

export default class EntityService {
    static async getActualEntities(): Promise<Entity<any>[]> {
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');

        const url = `${config.BASE_URL}/entity`;

        const entities = await fetch(url, {
            headers,
            method: 'GET',
        }).then((x) => x.json()) as Entity<any>[];

        return entities.filter((x) => actualDomains.indexOf(x.id.split('.')[0]) !== -1);
    }

    static async getEntities(type = ''): Promise<Entity<any>[]> {
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');

        const url = type ? `${config.BASE_URL}/entity?type=${type}` : `${config.BASE_URL}/entity`;

        return fetch(url, {
            headers,
            method: 'GET',
        }).then((x) => x.json());
    }

    static async getServices(): Promise<Service[]> {
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');

        return fetch(`${config.BASE_URL}/service`, {
            headers,
            method: 'GET',
        }).then((x) => x.json());
    }
}
