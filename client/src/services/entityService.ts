import type { Entity } from '../../types/entityType';
import type { Service } from '../../types/serviceType';
import http from '../utils/HttpHelper';

export async function getEntity<T extends Entity<unknown>>(id: string): Promise<T> {
    return http.get<T>(`/entity/${id}`);
}

export const actualDomains = ['binary_sensor', 'switch', 'sensor', 'light'];

export default class EntityService {
    /**
     * @returns entities with domain in `actualDomains`
     */
    static async getActualEntities(): Promise<Array<Entity<unknown>>> {
        return http.get<Array<Entity<unknown>>>('/entity')
            .then((entities) => entities.filter((x) => actualDomains.indexOf(x.id.split('.')[0]) !== -1));
    }

    static async getEntities(type = ''): Promise<Array<Entity<unknown>>> {
        return http.get(`/entity${type ? `?type=${type}` : ''}`);
    }

    static async getServices(): Promise<Service[]> {
        return http.get('/service');
    }
}
