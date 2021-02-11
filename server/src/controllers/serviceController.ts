import { Request, Response } from 'express';
import serviceService from '../services/serviceService';
import App from '../app';

@App.rest('/service')
class ServiceController {

    @App.get('')
    async getServices(req: Request, res: Response): Promise<void> {
        const result = await serviceService.getServices();
        res.status(200).send(result);
    }

}

export default new ServiceController();
