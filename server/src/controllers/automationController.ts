import { Request, Response } from 'express';
import automationService from '../services/automationService';
import App from '../app';
import { Automation, AutomationPreview } from '../types/automation';
import { NO_SUCH_ID, send, sendf } from '../utils/functions';
import { HaDumbType } from '../types/haTypes';

@App.rest('/automation')
class AutomationController {

    @App.get('')
    async getAutomations(_req: Request, res: Response): Promise<Response<AutomationPreview[]>> {
        return automationService.getAutomations()
            .then(sendf(res, 200));
    }

    @App.get('/:id')
    async getAutomationById(req: Request, res: Response)
    : Promise<Response<Automation> | Response<{ error: string }>> {
        const { id } = req.params;
        return automationService.getAutomationById(id)
            .then((automation: Automation | undefined) => {
                if (!automation) {
                    return send(res, 404, { error: NO_SUCH_ID(id) });
                }
                return send(res, 200, automation);
            });
    }

    @App.patch('/:id')
    async toggleAutomationById(req: Request, res: Response): Promise<Response<HaDumbType>> {
        const { id } = req.params;
        const { state } = req.body;
        return automationService.toggleAutomationById(id, state)
            .then(sendf(res, 200));
    }

    @App.post('')
    async createAutomation(req: Request, res: Response): Promise<Response<{
        result?: string | undefined;
        message?: string | undefined;
    }>> {
        const automation: Automation = req.body;
        return automationService.createAutomation(automation)
            .then(sendf(res, 200));
    }

    @App.post('/:id')
    async triggerAutomation(req: Request, res: Response): Promise<Response<HaDumbType>> {
        const { id } = req.params;
        return automationService.triggerAutomation(id)
            .then(sendf(res, 200));
    }

    @App.delete('/:id')
    async deleteAutomation(req: Request, res: Response): Promise<Response<any>> {
        const { id } = req.params;
        return automationService.deleteAutomation(id)
            .then(() => send(res, 200));
    }

}

export default new AutomationController();
