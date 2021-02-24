import { Request, Response } from 'express';
import userService from '../services/userService';
import App from '../app';
import { sendf, Success } from '../utils';
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

}

export default new UserController();
