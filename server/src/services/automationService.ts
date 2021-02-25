import { socketForwarder } from '../forwarders';
import { socketService, httpService } from '.';
import {
    EventObserver, Event, Automation, AutomationPreview,
    HaAutomation, HaDumbType, HaStateResponse, MAX_RETRIEVE_ATTEMPTS,
} from '../types';
import { logger } from '../utils';

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

    /* start inherited from EventObserver */

    onAutomationUpdated(id: string): void {
        this.retrieveAndEmit(id, 'automationUpdated');
    }

    onAutomationRemoved(id: string) {
        socketForwarder.emitSocket('automationRemoved', { id });
    }

    async onAutomationCreated(id: string) {
        this.retrieveAndEmit(id, 'automationCreated');
    }

    private retrieveAndEmit(id: string, event: Event, nbRec: number = 0) {
        this.getAutomationPreviewById(id)
            .then((updated: AutomationPreview | undefined) => {
                if (updated) {
                    socketForwarder.emitSocket(event, updated);
                    return;
                }
                if (event === 'automationCreated' && nbRec < MAX_RETRIEVE_ATTEMPTS) {
                    setTimeout(() => {
                        // eslint-disable-next-line no-param-reassign
                        this.retrieveAndEmit(id, event, nbRec++);
                    }, 2000);
                } else {
                    const error = `Unable to retrieve updated automation: ${id}`;
                    logger.error(error);
                    throw new Error(error);
                }
            })
            .catch((err) => socketForwarder
                .emitSocket('automationUpdated', { error: err.message }));
    }

    /* end inherited from EventObserver */

    /**
     * Get all automations
     * @returns all automations
     */
    async getAutomations(): Promise<AutomationPreview[]> {
        const states: HaStateResponse[] = await socketService.getStates();
        return states
            .filter((s: HaStateResponse) => s.entity_id
                .split('.')[0] === 'automation' && s.attributes.id)
            .map((automation: HaStateResponse) => ({
                id: automation.entity_id,
                name: automation.attributes.friendly_name,
                state: automation.state,
            }));
    }

    /**
     * Get an automation by its id
     * @param entityId Id of the automation
     * @returns the automation with the correct id, or undefined
     */
    async getAutomationById(entityId: string): Promise<Automation | undefined> {
        const automation = await this.getAutomationWithId(entityId);
        if (!automation) {
            return undefined;
        }

        return httpService
            .getAutomationById(automation.automationId)
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

    /**
     * Get an automation preview by its id
     * @param entityId Id of the automation preview
     * @returns the automation preview with the correct id, or undefined
     */
    async getAutomationPreviewById(id: string): Promise<AutomationPreview | undefined> {
        return this.getAutomations()
            .then((automations) => automations.find((a) => a.id === id));
    }

    private async getAutomationWithId(entityId: string)
    : Promise<AutomationPreviewWithId | undefined> {
        return socketService
            .getStates()
            .then((states) => states.find((s) => s.entity_id === entityId))
            .then((a) => {
                if (!a) {
                    return undefined;
                }
                return {
                    automationId: a.attributes.id,
                    id: a.entity_id,
                    name: a.attributes.friendly_name,
                    state: a.state,
                };
            });
    }

    /**
     * Toggle an automation
     */
    async toggleAutomationById(id: string, state: 'on' | 'off'): Promise<HaDumbType> {
        const service = state === 'on' ? 'turn_on' : 'turn_off';
        return socketService.callService('automation', service, { entity_id: id });
    }

    /**
     * Create an automation
     * @param automation the automation to create
     * @returns ???
     */
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

    /**
     * Trigger an automation
     * @param id id of the automation to trigger
     */
    async triggerAutomation(id: string): Promise<HaDumbType> {
        return socketService.callService('automation', 'trigger', { entity_id: id });
    }

    /**
     * Delete an automation
     * @param id id of the automation to trigger
     */
    async deleteAutomation(id: string): Promise<unknown> {
        return httpService.deleteAutomation(id);
    }

    async updateAutomation(automation: Automation): Promise<unknown> {
        const haAut: HaAutomation = {
            id: automation.id,
            alias: automation.name,
            mode: automation.mode,
            description: automation.description,
            trigger: automation.trigger,
            condition: automation.condition,
            action: automation.action,
        };
        return httpService.updateAutomation(haAut);
    }

}

export default new AutomationService();
