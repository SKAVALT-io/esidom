import type { Group } from '../../types/groupType';
import config from '../config/config';

export default class GroupService {
    static async getGroup(): Promise<Group[]> {
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        return fetch(`${config.BASE_URL}/group`, {
            headers,
            method: 'GET',
        })
            .then((res) => res.json())
            .catch((err) => console.log(err));
    }

    static async createGroup(group: Group): Promise<Group> {
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        return fetch(`${config.BASE_URL}/group`, {
            headers,
            method: 'POST',
            body: JSON.stringify(group),
        })
            .then((res) => res.json())
            .catch((err) => console.log(err));
    }
}
