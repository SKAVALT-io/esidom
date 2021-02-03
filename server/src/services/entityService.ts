import httpForwarder from '../forwarders/httpForwarder';
import socketForwarder from '../forwarders/socketForwarder';
import { Entity } from '../types/entity';

class EntityService {

    async getEntities(): Promise<Entity[]> {
        return new Promise((res, rej) => {});
    }

}

export default new EntityService();
