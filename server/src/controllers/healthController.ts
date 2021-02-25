import { Request, Response } from 'express';
import App from '../app';
import { healthService } from '../services';
import { logger, send } from '../utils';

@App.rest('/health')
class HealthController {

    /**
     * Check if HA is healthy or not
     * @returns An object `{ healthy: true }` if HA is available,
     * else an object `{ healthy: false }`
     */
    @App.get('')
    async getHealth(_req: Request, res: Response)
    : Promise<Response<{ healthy: true }> | Response<{ healthy: false }>> {
        return healthService
            .getHealth()
            .then(() => send(res, 200, { healthy: true }))
            .catch(() => {
                logger.error('HA is not healthy');
                return send(res, 200, { healthy: false });
            });

    }

}

export default new HealthController();
