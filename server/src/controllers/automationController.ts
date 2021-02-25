import { Request, Response } from 'express';
import App from '../app';
import { automationService } from '../services';
import { Automation, AutomationPreview, HaDumbType } from '../types';
import {
    logger,
    send, sendf, sendNoSuchId, Success, SuccessOrError,
} from '../utils';

@App.rest('/automation')
class AutomationController {

    /**
     * Get all automations
     * @returns all automations
     */
    @App.get('')
    async getAutomations(_req: Request, res: Response): Success<AutomationPreview[]> {
        return automationService
            .getAutomations()
            .then(sendf(res, 200));
    }

    /**
     * Get an automation by its id
     * @pathParam `id` Id of the automation
     * @returns the automation with the correct id, or an error
     */
    @App.get('/:id')
    async getAutomationById(req: Request, res: Response): SuccessOrError<Automation> {
        const { id } = req.params;
        return automationService
            .getAutomationById(id)
            .then((automation) => {
                if (!automation) {
                    return sendNoSuchId(res, id);
                }
                return send(res, 200, automation);
            });
    }

    /**
     * Toggle an automation
     */
    @App.patch('/:id')
    async toggleAutomationById(req: Request, res: Response): Success<HaDumbType> {
        const { id } = req.params;
        const { state } = req.body;
        return automationService
            .toggleAutomationById(id, state)
            .then(sendf(res, 200));
    }

    /**
     * Create an automation
     * @bodyParam `automation` the automation to create
     * @returns ???
     */
    @App.post('')
    async createAutomation(req: Request, res: Response): Success<{
        result?: string | undefined;
        message?: string | undefined;
    }> {
        const automation: Automation = req.body;
        return automationService
            .createAutomation(automation)
            .then(sendf(res, 200));
    }

    /**
     * Trigger an automation
     * @pathParam `id` id of the automation to trigger
     */
    @App.post('/:id')
    async triggerAutomation(req: Request, res: Response): Success<HaDumbType> {
        const { id } = req.params;
        return automationService
            .triggerAutomation(id)
            .then(sendf(res, 200));
    }

    /**
     * Delete an automation
     * @pathParam `id` id of the automation to trigger
     */
    @App.delete('/:id')
    async deleteAutomation(req: Request, res: Response): SuccessOrError<unknown> {
        const { id } = req.params;
        return automationService
            .deleteAutomation(id)
            .then(sendf(res, 200))
            .catch((err) => {
                logger.error(`Error while deleting automation ${id}: ${err}`);
                return send(res, 400, { error: err.message });
            });
    }

}

export default new AutomationController();
