import type { Group, NewGroup } from '../../types/groupType';
import config from '../config/config';
import HttpHelper from '../utils/HttpHelper';
import { tr } from '../utils/i18nHelper';

export default class GroupService {
    static async getGroup(): Promise<Group[]> {
        const groups = await HttpHelper.get<Group[]>('/group');

        return groups.map((g) => this.updateGroupNameIfIsImplicit(g));
    }

    static async createGroup(group: NewGroup): Promise<Group> {
        return HttpHelper.post('/group', group);
    }

    static async deleteGroup(group: Group): Promise<Group> {
        return HttpHelper.delete(`/group/${group.groupId}`);
    }

    static async updateGroup(group: Group): Promise<Group> {
        return HttpHelper.put(`/group/${group.groupId}`, group);
    }

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
