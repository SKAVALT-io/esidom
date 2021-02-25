import { Request, Response } from 'express';
import App from '../app';
import { groupService } from '../services';
import { Entity, Group } from '../types';
import {
    sendf, Success, SuccessOrError, sendMissingParam,
    sendMessage, send, SuccessMessageOrError, sendNoSuchId,
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
        const { name, entities } = req.body as {name: string, entities: Entity[]};
        if (!name) {
            return sendMissingParam(res, 'name');
        }
        if (!entities || entities.length === 0) {
            return sendMissingParam(res, 'entities');
        }

        return groupService
            .createGroup(name, entities.map((e) => e.id))
            .then(sendf<Group>(res, 200));
    }

    @App.put('/:groupId')
    async updateGroup(req: Request, res: Response): SuccessMessageOrError {
        const group: Group = req.body;
        if (!group) {
            return sendMissingParam(res, 'group');
        }
        return groupService.updateGroup(group)
            .then(() => sendMessage(res, 200, 'OK'))
            .catch((err) => send(res, 400, { error: err.message }));

    }

    @App.get('/:groupId')
    async getGroup(req: Request, res: Response): SuccessOrError<Group> {
        const { groupId } = req.params;
        if (!groupId) {
            return sendMissingParam(res, 'groupId');
        }
        return groupService.getGroup(groupId)
            .then((group: Group | undefined) => (group
                ? send(res, 200, group)
                : sendNoSuchId(res, groupId)
            ));
    }

    @App.delete('/:groupId')
    async deleteGroup(req: Request, res: Response): SuccessMessageOrError {
        const { groupId } = req.params;
        if (!groupId) {
            return sendMissingParam(res, 'groupId');
        }
        return groupService.deleteGroup(groupId)
            .then((success) => (success
                ? sendMessage(res, 200, 'OK')
                : sendNoSuchId(res, groupId)
            ));
    }

}

export default new GroupController();
