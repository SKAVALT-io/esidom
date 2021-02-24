import { Request, Response } from 'express';
import App from '../app';
import { serviceService } from '../services';
import { Service } from '../types';
import { sendf, Success } from '../utils';

@App.rest('/service')
class ServiceController {

    /**
     * Get all services
     * @returns All services
     */
    @App.get('')
    async getServices(_req: Request, res: Response): Success<Service[]> {
        return serviceService
            .getServices()
            .then(sendf(res, 200));
    }

}

export default new ServiceController();
