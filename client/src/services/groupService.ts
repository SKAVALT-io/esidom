import type { Group } from '../../types/groupType';
import HttpHelper from '../utils/HttpHelper';
import { tr } from '../utils/i18nHelper';

export default class GroupService {
    /**
     * Gets a group.
     */
    static async getGroup(): Promise<Group[]> {
        const groups = await HttpHelper.get<Group[]>('/group');

        return groups.map((g) => this.updateGroupNameIfIsImplicit(g));
    }

    /**
     * Creates a group.
     * @param group the new group
     */
    static async createGroup(group: Group): Promise<Group> {
        return HttpHelper.post('/group', group);
    }

    /**
     * Deletes a group.
     * @param group the group to delete
     */
    static async deleteGroup(group: Group): Promise<Group> {
        return HttpHelper.delete(`/group/${group.groupId}`);
    }

    /**
     * Updates a group.
     * @param group the group to be updated
     */
    static async updateGroup(group: Group): Promise<Group> {
        return HttpHelper.put(`/group/${group.groupId}`, group);
    }

    /**
     * Updates a group name if it's an implicit group
     * @param group the groupe to be updated
     */
    static updateGroupNameIfIsImplicit(group: Group): Group {
        const updatedGroup = group;
        if (updatedGroup.implicit) {
            updatedGroup.name = `[${tr('groups.implicitGroup.name')}] ${tr(`groups.implicitGroup.cat.${group.type}`)}`;
            if (group.room) {
                updatedGroup.name += `${tr('groups.implicitGroup.of')} ${group.room.name}`;
            }
        }
        return updatedGroup;
    }
}
