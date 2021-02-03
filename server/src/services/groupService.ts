import httpForwarder from '../forwarders/httpForwarder';
import { socketForwarder } from '../forwarders/socketForwarder';
import { Group } from '../types/group';

class GroupService {
    async getGroups(): Promise<Group[]> {
        return new Promise((res, res) => {});
    }
}

export default new GroupService();
