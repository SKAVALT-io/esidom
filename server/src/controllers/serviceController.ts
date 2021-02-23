import { Request, Response } from 'express';
import serviceService from '../services/serviceService';
import App from '../app';
import { Service } from '../types/service';
import { sendf } from '../utils/functions';

@App.rest('/service')
class ServiceController {

    @App.get('')
    async getServices(_req: Request, res: Response): Promise<Response<Service[]>> {
        return serviceService.getServices()
            .then(sendf(res, 200));
    }

}

export default new ServiceController();
