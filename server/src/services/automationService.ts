import socketForwarder from '../forwarders/socketForwarder';
import { HaAutomation, HaStateResponse } from '../types/haTypes';
import httpForwarder from '../forwarders/httpForwarder';
import { Automation, AutomationPreview } from '../types/automation';

// HA needs the automation id to find an automation, but the client
// will make its request using the entity_id of the automation
// so this interface is only used internally
interface AutomationPreviewWithId extends AutomationPreview {
    automationId: string;
}

class AutomationService {

    async getAutomations(): Promise<AutomationPreview[]> {
        const states: HaStateResponse[] = await socketForwarder
            .forward({ type: 'get_states' });
        return states
            .filter((s: HaStateResponse) => s.entity_id
                .split('.')[0] === 'automation' && s.attributes.id !== undefined) // TODO: validate that id != undefined will not skip valid automation
            .map((automation: HaStateResponse) => ({
                id: automation.entity_id,
                name: automation.attributes.friendly_name,
                state: automation.state,
            }));
    }

    async getAutomationById(entityId: string): Promise<Automation> {
        const automation: AutomationPreviewWithId = await this.getAutomationWithId(entityId);
        return httpForwarder.get<HaAutomation>(`/api/config/automation/config/${automation?.automationId}`)
            .then((auto: HaAutomation) => ({
                id: automation.id,
                name: auto.alias,
                state: automation.state,
                description: auto.description,
                trigger: auto.trigger,
                action: auto.action,
                condition: auto.condition,
                mode: auto.mode,
            }))
            .catch((err) => { throw err; });
    }

    private async getAutomationWithId(entityId: string): Promise<AutomationPreviewWithId> {
        const a: HaStateResponse | undefined = (await socketForwarder
            .forward<HaStateResponse[]>({ type: 'get_states' })
        ).find((s: HaStateResponse) => s.entity_id === entityId);
        if (a === undefined) {
            throw new Error(`No automation with id ${entityId}`);
        }
        return {
            automationId: a.attributes.id,
            id: a.entity_id,
            name: a.attributes.friendly_name,
            state: a.state,
        };
    }

}

export default new AutomationService();
