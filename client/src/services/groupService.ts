import type { Group } from '../../types/groupType';
import http from '../utils/HttpHelper';
import { tr } from '../utils/i18nHelper';
import toastService from '../utils/toast';

export default class GroupService {
    /**
     * Gets groups.
     */
    static async getGroups(): Promise<Group[]> {
        return http.get<Group[]>('/group')
            .then((groups) => groups.map((g) => this.updateGroupNameIfIsImplicit(g)))
            .catch((err) => {
                toastService.toast(tr('groups.errorWhileLoading'), 'error');
                throw err;
            });
    }

    /**
     * Creates a group.
     * @param group the new group
     */
    static async createGroup(group: Group): Promise<Group> {
        return http.post<Group, Group>('/group', group)
            .catch((err) => {
                toastService.toast(tr('groups.errorWhileCreating'), 'error');
                throw err;
            });
    }

    /**
     * Deletes a group.
     * @param group the group to delete
     */
    static async deleteGroup(group: Group): Promise<Group> {
        return http.delete<Group, Group>(`/group/${group.groupId}`)
            .catch((err) => {
                toastService.toast(tr('groups.errorWhileDeleting'), 'error');
                throw err;
            });
    }

    /**
     * Updates a group.
     * @param group the group to be updated
     */
    static async updateGroup(group: Group): Promise<Group> {
        return http.put<Group, Group>(`/group/${group.groupId}`, group)
            .catch((err) => {
                toastService.toast(tr('groups.errorWhileUpdating'), 'error');
                throw err;
            });
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
