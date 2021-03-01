import type { Automation, AutomationPreview } from '../../types/automationType';
import http from '../utils/HttpHelper';

export default class AutomationService {
    /**
     * Gets the automations.
     */
    static async getAutomations(): Promise<AutomationPreview[]> {
        return http.get('/automation');
    }

    /**
     * Toggles the state of an automation.
     * @param id the id of the automation
     * @param state the new state of the automation
     */
    static async toggleAutomation(id: string, state: { state: 'on' | 'off' }): Promise<void> {
        return http.patch(`/automation/${id}`, state);
    }

    /**
     * Trigger an automation.
     * @param id the id of the automation
     */
    static async triggerAutomation(id: string): Promise<void> {
        return http.post(`/automation/${id}`);
    }

    /**
     * Gets an automation by its id.
     * @param id the id of the automation
     */
    static async getAutomationById(id: string): Promise<Automation> {
        return http.get(`/automation/${id}`);
    }

    /**
     * Creates a new automation.
     * @param automation the json automation
     */
    static async postAutomation(automation: Automation): Promise<void> {
        return http.post('/automation', automation);
    }

    /**
     * Deletes an automation.
     * @param id the id of the automation
     */
    static async deleteAutomation(id: string): Promise<void> {
        return http.delete(`/automation/${id}`);
    }

    /**
     * Updates an automation.
     * @param automation the new json automation
     */
    static async patchAutomation(automation: Automation): Promise<void> {
        return http.patch('/automation', automation);
    }
}
