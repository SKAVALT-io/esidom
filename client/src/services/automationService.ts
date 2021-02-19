import type { Automation, AutomationPreview } from '../../types/automationType';
import config from '../config/config';

export default class AutomationService {
    static async getAutomations(): Promise<AutomationPreview[]> {
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        return fetch(`${config.BASE_URL}/automation`, {
            headers,
            method: 'GET',
        })
            .then((res) => res.json());
    }

    static async toggleAutomation(id: string, state: 'on' | 'off'): Promise<void> {
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        return fetch(`${config.BASE_URL}/automation/${id}`, {
            headers,
            method: 'PATCH',
            body: JSON.stringify({
                state,
            }),
        })
            .then((res) => console.log(res));
    }

    static async triggerAutomation(id: string): Promise<void> {
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        return fetch(`${config.BASE_URL}/automation/${id}`, {
            headers,
            method: 'POST',
        })
            .then((res) => res.json());
    }

    static async getAutomationById(id: string): Promise<Automation> {
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        return fetch(`${config.BASE_URL}/automation/${id}`, {
            headers,
            method: 'GET',
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("L'id ne semble pas correct.");
                }
                return res.json();
            });
    }

    static async postAutomation(automation: Automation): Promise<void> {
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        return fetch(`${config.BASE_URL}/automation`, {
            headers,
            method: 'POST',
            body: JSON.stringify({
                automation,
            }),
        })
            .then((res) => res.json());
    }
}
