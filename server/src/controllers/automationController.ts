import { Request, Response } from 'express';
import automationService from '../services/automationService';
import { App } from '../app';

@App.rest('/automation')
class AutomationController {
    @App.get('')
    async getAutomations(req: Request, res: Response): Promise<void> {
        const result = await automationService.getAutomations();
        res.status(200).send(result);
        console.log(this);
    }
}

export default AutomationController;
