import { Group } from '../types/group';

class GroupService {

    async getGroups(): Promise<Group[]> {
        return new Promise(() => {});
    }

}

export default new GroupService();
