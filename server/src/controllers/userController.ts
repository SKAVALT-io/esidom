import { Request, Response } from 'express';
import userService from '../services/userService';
import App from '../app';
import { send, sendf, Success, SuccessOrError } from '../utils';
import { User } from '../types';

@App.rest('/user')
class UserController {

    /**
     * Get all the users
     */
    @App.get('')
    async getUsers(req: Request, res: Response): Success<User[]> {
        return userService
            .getUsers()
            .then(sendf(res, 200));
    }

    @App.post('/lock')
    async lock(req: Request, res: Response): SuccessOrError<string> {
        const { password } = req.body as { password: string };

        return userService
            .lockFront(password)
            .then(sendf(res, 200))
            .catch((e) => send(res, 401, { error: e }));
    }

    @App.post('/unlock')
    async unlock(req: Request, res: Response): Success<boolean> {
        const { password } = req.body as { password: string };

        return userService
            .unlockFront(password)
            .then(sendf(res, 200));
    }

    @App.get('/isLocked')
    async isLocked(req: Request, res: Response): Success<boolean> {
        return userService
            .isLocked()
            .then(sendf(res, 200));
    }

}

export default new UserController();
