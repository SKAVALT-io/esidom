import type { Entity } from '../../types/entityType';
import type { Service } from '../../types/serviceType';
import http from '../utils/HttpHelper';
import { tr } from '../utils/i18nHelper';
import toastService from '../utils/toast';
import UserService from './userService';

export async function getEntity<T extends Entity<unknown>>(id: string): Promise<T> {
    return http.get<T>(`/entity/${id}`);
}

export const actualDomains = ['binary_sensor', 'switch', 'sensor', 'light'];

export default class EntityService {
    /**
     * @returns entities with domain in `actualDomains`
     */
    static async getActualEntities(): Promise<Array<Entity<unknown>>> {
        return EntityService.getEntities()
            .then((entities) => entities.filter((x) => actualDomains.indexOf(x.id.split('.')[0]) !== -1))
            .catch(() => {
                toastService.toast(tr('entities.errorWhileLoading'), 'error');
                return [];
            });
    }

    static async getEntities(type = ''): Promise<Array<Entity<unknown>>> {
        const { currentUser } = UserService;
        if (currentUser && !currentUser.admin && !(currentUser.entities.length === 0)) {
            return http.get<Array<Entity<unknown>>>(`/entity?userId=${currentUser.id}${type ? `&type=${type}` : ''}`)
                .then((entities) => entities)
                .catch(() => {
                    toastService.toast(tr('entities.errorWhileLoading'), 'error');
                    return [];
                });
        }
        return http.get<Array<Entity<unknown>>>(`/entity${type ? `?type=${type}` : ''}`)
            .then((entities) => entities)
            .catch(() => {
                toastService.toast(tr('entities.errorWhileLoading'), 'error');
                return [];
            });
    }

    static async getServices(): Promise<Service[]> {
        return http.get<Service[]>('/service')
            .then((services) => services)
            .catch(() => {
                toastService.toast(tr('entities.errorWhileLoadingServices'), 'error');
                return [];
            });
    }

    static async patchEntityName(id:string, name: string): Promise<void> {
        return http.patch<void, {name:string}>(`/entity/update/${id}`, { name })
            .catch(() => {
                toastService.toast(tr('entities.errorWhileUpdating'), 'error');
            });
    }

    static async getLightAndSwitchEntity():Promise<Entity<any>[]> {
        const lights = await EntityService.getEntities('light');
        const switchs = await EntityService.getEntities('switch');
        return lights.concat(switchs);
    }

    static async turnOn(id: string): Promise<unknown> {
        return http.put(`/entity/${id}`, {
            service: 'homeassistant.turn_on',
        }).catch(() => {
            toastService.toast(tr('entities.errorWhileToggle'), 'error');
        });
    }

    static async toggle(id: string): Promise<unknown> {
        return http.put(`/entity/${id}`, {
            service: 'homeassistant.toggle',
        }).catch(() => {
            toastService.toast(tr('entities.errorWhileToggle'), 'error');
        });
    }

    static async turnOff(id: string): Promise<unknown> {
        return http.put(`/entity/${id}`, {
            service: 'homeassistant.turn_off',
        }).catch(() => {
            toastService.toast(tr('entities.errorWhileToggle'), 'error');
        });
    }
}
