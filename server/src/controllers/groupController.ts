import { Request, Response } from 'express';
import groupService from '../services/groupService';
import App from '../app';

@App.rest('/group')
class GroupController {

    @App.get('')
    async getGroups(req: Request, res: Response): Promise<void> {
        const result = await groupService.getGroups();
        res.status(200).send(result);
        console.log(this);
    }

}

export default new GroupController();
