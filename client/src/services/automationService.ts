import type { AutomationPreview } from '../../types/automationType';
import config from '../config/config';

export default class AutomationService {
    static async getAutomations(): Promise<AutomationPreview[]> {
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        return fetch(`${config.BASE_URL}/automation`, {
            headers,
            method: 'GET',
        })
            .then((res) => res.json())
            .catch((err) => console.log(err));
    }
}
