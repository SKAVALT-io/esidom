import { Request, Response } from 'express';
import App from '../app';
import { authService } from '../services';
import { send, SuccessOrError } from '../utils';
import config from '../config/config';

@App.rest('/auth')
class AuthController {

    /**
     * Do auth
     * @returns the token
     */
    @App.get('')
    async doAuth(req: Request, res: Response): SuccessOrError<{token: string}> {
        const baseUrl = req.params.baseUrl || `http://${config.baseUrl}`;
        const username = req.params.username || config.username;
        const password = req.params.password || config.password;
        return authService
            .doAuth(baseUrl, username, password)
            .then((token) => send(res, 200, { token }))
            .catch(() => send(res, 401, { error: 'Unauthorized' }));
    }

}

export default new AuthController();
