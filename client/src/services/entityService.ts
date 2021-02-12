import type { Entity } from '../../types/entityType';
import type { Service } from '../../types/ServiceType';
import config from '../config/config';

export default class EntityService {
    static async getEntities(type = ''): Promise<Entity[]> {
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
