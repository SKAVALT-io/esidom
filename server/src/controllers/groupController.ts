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

    @App.post('')
    async createGroup(req: Request, res: Response): Promise<void> {
        if (req.body.name === undefined || req.body.name === '') {
            res.status(400).send({ message: 'The parameter name is missing' });
            return;
        }
        if (req.body.entities === undefined || req.body.name === []) {
            res.status(400).send({ message: 'The parameter entities is missing' });
            return;
        }
        const result = await groupService.createGroup(req.body.name, req.body.entities);
        res.status(200).send(result);
    }

}

export default new GroupController();
