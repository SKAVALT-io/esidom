import { Request, Response } from 'express';
import automationService from '../services/automationService';
import App from '../app';
import { Automation, AutomationPreview } from '../types/automation';

@App.rest('/automation')
class AutomationController {

    @App.get('')
    getAutomations(req: Request, res: Response): void {
        automationService.getAutomations()
            .then((automations: AutomationPreview[]) => res.status(200).send(automations))
            .catch((err) => res.status(404).send({ message: err.message }));
    }

    @App.get('/:id')
    getAutomationById(req: Request, res: Response): void {
        const { id } = req.params;
        automationService.getAutomationById(id)
            .then((automation: Automation) => res.status(200).send(automation))
            .catch((err) => res.status(404).send({ message: err.message }));
    }

    @App.patch('/:id')
    toggleAutomationById(req: Request, res: Response): void {
        const { id } = req.params;
        const { state } = req.body;
        automationService.toggleAutomationById(id, state)
            .then((result: void) => res.status(200).send(result))
            .catch((err) => res.status(404).send({ message: err.message }));
    }

}

export default new AutomationController();
