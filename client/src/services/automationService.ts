import type { Automation, AutomationPreview } from '../../types/automationType';
import http from '../utils/HttpHelper';

export default class AutomationService {
    static async getAutomations(): Promise<AutomationPreview[]> {
        return http.get('/automation');
    }

    static async toggleAutomation(id: string, state: 'on' | 'off'): Promise<void> {
        return http.patch(`/automation/${id}`, { state });
    }

    static async triggerAutomation(id: string): Promise<void> {
        return http.post(`/automation/${id}`);
    }

    static async getAutomationById(id: string): Promise<Automation> {
        return http.get(`/automation/${id}`);
    }

    static async postAutomation(automation: Automation): Promise<void> {
        return http.post('/automation', automation);
    }

    static async deleteAutomation(id: string): Promise<void> {
        return http.delete(`/automation/${id}`);
    }

    static async patchAutomation(automation: Automation): Promise<void> {
        return http.patch('/automation', automation);
    }
}
