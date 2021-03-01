import type { Group } from '../../types/groupType';
import http from '../utils/HttpHelper';
import { tr } from '../utils/i18nHelper';
import toastService from '../utils/toast';

export default class GroupService {
    static async getGroup(): Promise<Group[]> {
        return http.get<Group[]>('/group')
            .then((groups) => groups.map((g) => this.updateGroupNameIfIsImplicit(g)))
            .catch(() => {
                toastService.toast(tr('groups.errorWhileLoading'), 'error');
                return [];
            });
    }

    static async createGroup(group: Group): Promise<Group> {
        return http.post<Group, Group>('/group', group)
            .then((g) => g)
            .catch(() => {
                toastService.toast(tr('groups.errorWhileCreating'), 'error');
                return group;
            });
    }

    static async deleteGroup(group: Group): Promise<Group> {
        return http.delete<Group, Group>(`/group/${group.groupId}`)
            .then((g) => g)
            .catch(() => {
                toastService.toast(tr('groups.errorWhileDeleting'), 'error');
                return group;
            });
    }

    static async updateGroup(group: Group): Promise<Group> {
        return http.put<Group, Group>(`/group/${group.groupId}`, group)
            .then((g) => g)
            .catch(() => {
                toastService.toast(tr('groups.errorWhileUpdating'), 'error');
                return group;
            });
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
