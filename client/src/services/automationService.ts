import type { Automation, AutomationPreview } from '../../types/automationType';
import http from '../utils/HttpHelper';
import { tr } from '../utils/i18nHelper';
import toastService from '../utils/toast';

export default class AutomationService {
    static async getAutomations(): Promise<AutomationPreview[]> {
        return http.get<AutomationPreview[]>('/automation')
            .then((a) => a)
            .catch(() => {
                toastService.toast(tr('automations.errorWhileLoading'), 'error');
                return [];
            });
    }

    static async toggleAutomation(id: string, state: { state: 'on' | 'off' }): Promise<void> {
        return http.patch<void, { state: 'on' | 'off' }>(`/automation/${id}`, state)
            .catch(() => toastService.toast(tr('automations.errorWhileToggling'), 'error'));
    }

    static async triggerAutomation(id: string): Promise<void> {
        return http.post<void, undefined>(`/automation/${id}`)
            .catch(() => toastService.toast(tr('automations.errorWhileTriggering'), 'error'));
    }

    static async getAutomationById(id: string): Promise<Automation> {
        return http.get<Automation>(`/automation/${id}`)
            .then((a) => a)
            .catch(() => {
                toastService.toast(tr('automations.errorWhileGettingAutomation'), 'error');
                return {} as Automation;
            });
    }

    static async postAutomation(automation: Automation): Promise<void> {
        return http.post<void, Automation>('/automation', automation)
            .then((a) => a)
            .catch(() => toastService.toast(tr('automations.errorWhileCreating'), 'error'));
    }

    static async deleteAutomation(id: string): Promise<void> {
        return http.delete<void, undefined>(`/automation/${id}`)
            .catch(() => toastService.toast(tr('automations.errorWhileDeleting'), 'error'));
    }

    static async patchAutomation(automation: Automation): Promise<void> {
        return http.patch<void, Automation>('/automation', automation)
            .catch(() => toastService.toast(tr('automations.errorWhileUpdating'), 'error'));
    }
}
