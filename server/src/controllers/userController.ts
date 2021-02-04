import { Request, Response } from 'express';
import userService from '../services/userService';
import App from '../app';

@App.rest('/user')
class UserController {

    @App.get('')
    async getUsers(req: Request, res: Response): Promise<void> {
        const result = await userService.getUsers();
        res.status(200).send(result);
        console.log(this);
    }

}

export default new UserController();
