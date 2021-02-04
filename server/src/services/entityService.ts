import { Device } from '../types/device';
import httpForwarder from '../forwarders/httpForwarder';
import socketForwarder from '../forwarders/socketForwarder';
import { Entity } from '../types/entity';
import deviceService from './deviceService';

class EntityService {

    async getEntities(): Promise<Entity[]> {
        const devices: Device[] = await deviceService.getDevices();
        return devices
            .map((device: Device) => device.entities)
            .flat();
    }

    async getEntityById(id: string) {
        const entities = await this.getEntities();
        return entities.find((e: Entity) => e.id === id);
    }

}

export default new EntityService();
