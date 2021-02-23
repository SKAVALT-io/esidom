import { Request, Response } from 'express';
import App from '../app';
import healthService from '../services/healthService';
import { send } from '../utils/functions';

@App.rest('/health')
class HealthController {

    @App.get('')
    async getHealth(_req: Request, res: Response)
    : Promise<Response<{ healthy: true }> | Response<{ healthy: false }>> {
        return healthService.getHealth()
            .then(() => send(res, 200, { healthy: true }))
            .catch(() => send(res, 200, { healthy: false }));
    }

}

export default new HealthController();
