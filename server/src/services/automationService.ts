import socketForwarder from '../forwarders/socketForwarder';
import { HaAutomation, HaDumbType, HaStateResponse } from '../types/haTypes';
import { Automation, AutomationPreview } from '../types/automation';
import { EventObserver } from '../types/observer';
import socketService from './socketService';
import httpService from './httpService';

// HA needs the automation id to find an automation, but the client
// will make its request using the entity_id of the automation
// so this interface is only used internally
interface AutomationPreviewWithId extends AutomationPreview {
    automationId: string;
}

class AutomationService implements EventObserver {

    constructor() {
        socketForwarder.registerObserver(this);
    }

    onAutomationUpdated(data: string) {
        this.getAutomationById(data)
            .then((updated: Automation | undefined) => {
                if (!updated) {
                    return;
                }
                const updatedPreview: AutomationPreview = {
                    id: updated.id,
                    name: updated.name,
                    state: updated.state,
                };
                socketForwarder.emitSocket('entity_updated', updatedPreview);
            })
            .catch((err) => socketForwarder
                .emitSocket('entity_updated', { error: err.message }));
    }

    onAutomationRemoved(id: string) {
        socketForwarder.emitSocket('automation_removed', { id });
    }

    async onAutomationCreated(id: string) {
        const automation: AutomationPreview | undefined = await this
            .getAutomationPreviewById(id);
        if (!automation) { // wait for HA to finish initializing automation
            setTimeout(() => {
                this.onAutomationCreated(id);
            }, 2000);
        } else {
            socketForwarder.emitSocket('automation_created', automation);
        }
    }

    async getAutomations(): Promise<AutomationPreview[]> {
        const states: HaStateResponse[] = await socketService.getStates();
        return states
            .filter((s: HaStateResponse) => s.entity_id
                .split('.')[0] === 'automation' && s.attributes.id !== undefined)
            .map((automation: HaStateResponse) => ({
                id: automation.entity_id,
                name: automation.attributes.friendly_name,
                state: automation.state,
            }));
    }

    async getAutomationById(entityId: string): Promise<Automation | undefined> {
        const automation: AutomationPreviewWithId | undefined = await this
            .getAutomationWithId(entityId);
        if (!automation) {
            return undefined;
        }
        return httpService.getAutomationById(automation.automationId)
            .then((auto: HaAutomation) => ({
                id: automation.id,
                name: auto.alias,
                state: automation.state,
                description: auto.description,
                trigger: auto.trigger,
                action: auto.action,
                condition: auto.condition,
                mode: auto.mode,
            }));
    }

    async getAutomationPreviewById(id: string): Promise<AutomationPreview | undefined> {
        const automations: AutomationPreview[] = await this.getAutomations();
        const automation: AutomationPreview | undefined = automations
            .find((a: AutomationPreview) => a.id === id);
        return automation;
    }

    private async getAutomationWithId(entityId: string)
    : Promise<AutomationPreviewWithId | undefined> {
        const a: HaStateResponse | undefined = (await socketService.getStates()
        ).find((s: HaStateResponse) => s.entity_id === entityId);
        if (!a) {
            return undefined;
        }
        return {
            automationId: a.attributes.id,
            id: a.entity_id,
            name: a.attributes.friendly_name,
            state: a.state,
        };
    }

    async toggleAutomationById(id: string, state: 'on' | 'off'): Promise<HaDumbType> {
        const service = state === 'on' ? 'turn_on' : 'turn_off';
        const data = { entity_id: id };
        return socketService.callService('automation', service, data);
    }

    async createAutomation(automation: Automation): Promise<{ result?: string, message?: string}> {
        const haAut: HaAutomation = {
            id: automation.id,
            alias: automation.name,
            mode: automation.mode,
            description: automation.description,
            trigger: automation.trigger,
            condition: automation.condition,
            action: automation.action,
        };
        return httpService.postAutomation(haAut);
    }

    async triggerAutomation(id: string): Promise<HaDumbType> {
        const data = { entity_id: id };
        return socketService.callService('automation', 'trigger', data);
    }

    async deleteAutomation(id: string): Promise<any> {
        return httpService.deleteAutomation(id);
    }

}

export default new AutomationService();
