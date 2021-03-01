import type { Entity } from '../../types/entityType';
import type { Service } from '../../types/serviceType';
import http from '../utils/HttpHelper';
import UserService from './userService';

export async function getEntity<T extends Entity<unknown>>(id: string): Promise<T> {
    return http.get<T>(`/entity/${id}`);
}

export const actualDomains = ['binary_sensor', 'switch', 'sensor', 'light'];

export default class EntityService {
    /**
     * Gets actual entities.
     * @returns entities with domain in `actualDomains`
     */
    static async getActualEntities(): Promise<Array<Entity<unknown>>> {
        return EntityService.getEntities()
            .then((entities) => entities.filter((x) => actualDomains.indexOf(x.id.split('.')[0]) !== -1));
    }

    /**
     * Gets entities.
     * @param type the type of the entities
     */
    static async getEntities(type = ''): Promise<Array<Entity<unknown>>> {
        const { currentUser } = UserService;
        if (currentUser && !currentUser.admin && !(currentUser.entities.length === 0)) {
            return http.get(`/entity?userId=${currentUser.id}${type ? `&type=${type}` : ''}`);
        }
        return http.get(`/entity${type ? `?type=${type}` : ''}`);
    }

    /**
     * Gets services.
     */
    static async getServices(): Promise<Service[]> {
        return http.get('/service');
    }

    /**
     * Updates an entity name.
     * @param id the id of the entity
     * @param name the new entity name
     */
    static async patchEntityName(id:string, name: string): Promise<void> {
        return http.patch(`/entity/update/${id}`, { name });
    }

    /**
     * Gets light and switch entities.
     */
    static async getLightAndSwitchEntity():Promise<Entity<any>[]> {
        const lights = await EntityService.getEntities('light');
        const switchs = await EntityService.getEntities('switch');
        return lights.concat(switchs);
    }

    /**
     * Turns on an entity.
     * @param id the id of the entity
     */
    static async turnOn(id: string): Promise<unknown> {
        return http.put(`/entity/${id}`, {
            service: 'homeassistant.turn_on',
        });
    }

    /**
     * Toggles an entity.
     * @param id the id of the entity
     */
    static async toggle(id: string): Promise<unknown> {
        return http.put(`/entity/${id}`, {
            service: 'homeassistant.toggle',
        });
    }

    /**
     * Turns off an entity.
     * @param id the id of the entity
     */
    static async turnOff(id: string): Promise<unknown> {
        return http.put(`/entity/${id}`, {
            service: 'homeassistant.turn_off',
        });
    }
}
