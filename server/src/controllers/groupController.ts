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
        const { name, entities } = req.body;
        if (name === undefined || name === '') {
            res.status(400).send({ message: 'The parameter name is missing' });
            return;
        }
        if (entities === undefined || entities === []) {
            res.status(400).send({ message: 'The parameter entities is missing' });
            return;
        }
        try {
            const result = await groupService.createGroup(name, entities);
            res.status(200).send(result);
        } catch (err: any) {
            res.status(400).send({ message: err.message ? err.message : err });
        }
    }

}

export default new GroupController();
