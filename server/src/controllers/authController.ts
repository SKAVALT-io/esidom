import { Request, Response } from 'express';
import App from '../app';
import authService from '../services/authService';

@App.rest('/auth')
class AuthController {

    @App.get('')
    async doAuth(req: Request, res: Response): Promise<Response<{token: string}>> {
        return authService.doAuth(req, res);
    }

}

export default new AuthController();
