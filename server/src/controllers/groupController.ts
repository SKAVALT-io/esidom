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

    @App.put('/:groupId')
    async updateGroup(req: Request, res: Response): Promise<void> {
        const group: Group = req.body;
        if (!group) {
            res.status(400).send({ message: 'The group is missing' });
            return;
        }
        console.log(group);
        try {
            await groupService.updateGroup(group);
            res.status(200).send({ message: 'OK' });
        } catch (err: any) {
            res.status(400).send({ message: err.message ? err.message : err });
        }
    }

    @App.get('/:groupId')
    async getGroup(req: Request, res: Response): Promise<void> {
        try {
            const { groupId } = req.params;
            if (!groupId) {
                res.status(400).send({ message: 'The parameter groupId is missing' });
                return;
            }
            const result = await groupService.getGroup(groupId);
            res.status(200).send(result);
        } catch (err) {
            res.status(400).send({ message: err });
        }
    }

    @App.delete('/:groupId')
    async deleteGroup(req: Request, res: Response): Promise<void> {
        try {
            const { groupId } = req.params;
            console.log(groupId);
            if (!groupId) {
                res.status(400).send({ message: 'The parameter groupId is missing' });
                return;
            }
            await groupService.deleteGroup(groupId);
            res.status(200).send({ message: 'Ok' });
        } catch (err) {
            console.log(err);
            res.status(400).send({ message: err });
        }
    }

}

export default new GroupController();
