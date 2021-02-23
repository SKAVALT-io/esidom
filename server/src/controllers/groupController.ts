import { Request, Response } from 'express';
import groupService from '../services/groupService';
import App from '../app';
import { Group } from '../types/group';
import { send, sendf } from '../utils/functions';

const MISSING_PARAM = (name: string): string => `Missing parameter ${name}`;
@App.rest('/group')
class GroupController {

    @App.get('')
    async getGroups(_req: Request, res: Response): Promise<Response<Group[]>> {
        return groupService.getGroups()
            .then(sendf(res, 200));
    }

    @App.post('')
    async createGroup(req: Request, res: Response)
    : Promise<Response<{error: string}> | Response<Group>> {
        const { name, entities } = req.body;
        if (!name) {
            return send(res, 404, { error: MISSING_PARAM('name') });
        }
        if (!entities || entities.length === 0) {
            return send(res, 404, { error: MISSING_PARAM('entities') });
        }
        return groupService.createGroup(name, entities)
            .then(sendf<Group>(res, 200));
    }

}

export default new GroupController();
