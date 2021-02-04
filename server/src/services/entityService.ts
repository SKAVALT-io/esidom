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

}

export default new EntityService();
