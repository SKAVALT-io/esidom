import { Request, Response } from 'express';
import App from '../app';
import { groupService } from '../services';
import { Group } from '../types';
import {
    sendf, Success, SuccessOrError, sendMissingParam,
} from '../utils';

@App.rest('/group')
class GroupController {

    /**
     * Get all the groups
     * @returns All the groups
     */
    @App.get('')
    async getGroups(_req: Request, res: Response): Success<Group[]> {
        return groupService
            .getGroups()
            .then(sendf(res, 200));
    }

    /**
     * Create a group
     * @bodyParam name Name of the group
     * @bodyParam entities Entities attached to this group
     * @returns The newly created group, or an error
     */
    @App.post('')
    async createGroup(req: Request, res: Response): SuccessOrError<Group> {
        const { name, entities } = req.body;
        if (!name) {
            return sendMissingParam(res, 'name');
        }
        if (!entities || entities.length === 0) {
            return sendMissingParam(res, 'entities');
        }

        return groupService
            .createGroup(name, entities)
            .then(sendf<Group>(res, 200));
    }

}

export default new GroupController();
