import { Request, Response } from 'express';
import userService from '../services/userService';
import App from '../app';
import {
    send, sendf,
    Success, SuccessMessageOrError, SuccessOrError,
} from '../utils';
import { User } from '../types';

@App.rest('/user')
class UserController {

    /**
     * Get all the users
     * @return an array of users
     */
    @App.get('')
    async getUsers(req: Request, res: Response): Success<User[]> {
        return userService
            .getUsers()
            .then(sendf(res, 200));
    }

    /**
     * Get an user by its id
     * @pathParam id: id of the user
     * @return the user matching the given id
     */
    @App.get('/:id')
    async getUserByd(req: Request, res: Response): SuccessOrError<User> {
        const { id } = req.params;
        return userService
            .getUserById(parseInt(id, 10))
            .then(sendf(res, 200))
            .catch((err) => send(res, 400, { error: err.message }));
    }

    /**
     * Create a new user
     * @pathParam username: username of the user
     * @pathParam admin: a boolean indicating if the user is admin or not
     * @pathParam entities?: an array of string representing entities ID
     *            associated to this user
     * @return the created user
     */
    @App.post('')
    async createUser(req: Request, res: Response): SuccessOrError<User> {
        const { username, admin, entities } = req.body;
        return userService
            .createUser(username, admin, entities)
            .then(sendf(res, 200))
            .catch((err) => send(res, 400, { error: err.message }));
    }

    @App.put('/:id')
    async updateUser(req: Request, res: Response): SuccessOrError<User> {
        const { id } = req.params;
        const { username, admin, entities } = req.body;
        return userService
            .updateUser(parseInt(id, 10), username, admin, entities)
            .then(sendf(res, 200))
            .catch((err) => send(res, 400, { error: err.message }));
    }

    @App.delete('/:id')
    async deleteUser(req: Request, res: Response): SuccessMessageOrError {
        const { id } = req.params;
        return userService
            .deleteUser(parseInt(id, 10))
            .then(() => send(res, 200, { message: 'ok' }))
            .catch((err) => send(res, 400, { error: err.message }));
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
