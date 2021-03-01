import type { Automation, AutomationPreview } from '../../types/automationType';
import http from '../utils/HttpHelper';
import { tr } from '../utils/i18nHelper';
import toastService from '../utils/toast';

export default class AutomationService {
    static async getAutomations(): Promise<AutomationPreview[]> {
        return http.get<AutomationPreview[]>('/automation')
            .catch((err) => {
                toastService.toast(tr('automations.errorWhileLoading'), 'error');
                throw err;
            });
    }

    static async toggleAutomation(id: string, state: { state: 'on' | 'off' }): Promise<void> {
        return http.patch<void, { state: 'on' | 'off' }>(`/automation/${id}`, state)
            .catch((err) => {
                toastService.toast(tr('automations.errorWhileToggling'), 'error');
                throw err;
            });
    }

    static async triggerAutomation(id: string): Promise<void> {
        return http.post<void, undefined>(`/automation/${id}`)
            .catch((err) => {
                toastService.toast(tr('automations.errorWhileTriggering'), 'error');
                throw err;
            });
    }

    static async getAutomationById(id: string): Promise<Automation> {
        return http.get<Automation>(`/automation/${id}`)
            .catch((err) => {
                toastService.toast(tr('automations.errorWhileGettingAutomation'), 'error');
                throw err;
            });
    }

    static async postAutomation(automation: Automation): Promise<void> {
        return http.post<void, Automation>('/automation', automation)
            .catch((err) => {
                toastService.toast(tr('automations.errorWhileCreating'), 'error');
                throw err;
            });
    }

    static async deleteAutomation(id: string): Promise<void> {
        return http.delete<void, undefined>(`/automation/${id}`)
            .catch((err) => {
                toastService.toast(tr('automations.errorWhileDeleting'), 'error');
                throw err;
            });
    }

    static async patchAutomation(automation: Automation): Promise<void> {
        return http.patch<void, Automation>('/automation', automation)
            .catch((err) => {
                toastService.toast(tr('automations.errorWhileUpdating'), 'error');
                throw err;
            });
    }
}
