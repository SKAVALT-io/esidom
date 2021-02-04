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

    async updateEntityState(id: string, service: string, serviceData: any) {
        const entity: Entity | undefined = await this.getEntityById(id);
        if (entity === undefined) {
            return entity;
        }
        const res = socketForwarder.forward<any>({
            type: 'call_service',
            domain: service.split('.')[0],
            service: service.split('.')[1],
            service_data: serviceData,
        });
        return res;
    }

}

export default new EntityService();
