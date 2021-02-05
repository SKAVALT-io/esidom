import httpForwarder from '../forwarders/httpForwarder';
import socketForwarder from '../forwarders/socketForwarder';
import { Device, HaDevice } from '../types/device';
import { Entity, HaEntity } from '../types/entity';

class DeviceService {

    async getDevices(): Promise<Device[]> {
        const deviceRegistry: HaDevice[] = await socketForwarder
            .forward<HaDevice[]>({ type: 'config/device_registry/list' });
        const entityRegistry: HaEntity[] = await socketForwarder
            .forward<HaEntity[]>({ type: 'config/entity_registry/list' });
        const states: any[] = await socketForwarder
            .forward<any[]>({ type: 'get_states' });

        return deviceRegistry.map((entry: HaDevice) => {
            const { id, name, model } = entry;
            const device: Device = {
                id, name, model, entities: [], automations: [],
            };
            const deviceEntities: Entity[] = entityRegistry
                .filter((e: HaEntity) => e.device_id === device.id)
                .map((e: HaEntity) => {
                    const entity: Entity = {
                        id: e.config_entry_id,
                        entityId: e.entity_id,
                        name: e.name,
                        type: e.entity_id.split('.')[0],
                        model: device.model,
                        data: states.filter((s: any) => s.entity_id === e.entity_id),
                    };
                    return entity;
                });
            device.entities = deviceEntities;
            return device;
        });
    }

    async getDeviceById(id: string) {
        const devices: Device[] = await this.getDevices();
        return devices.find((d: Device) => d.id === id);
    }

    async pairdevice(protocol: string): Promise<boolean> {

        switch (protocol.toLowerCase()) {
        case 'zwave': {
            await httpForwarder.post<any>('/api/services/zwave/add_node', null);
            return true;
        }
        case 'zigbee': {
            await socketForwarder.forward<any>({
                type: 'call_service',
                domain: 'mqtt',
                service: 'publish',
                service_data: {
                    topic: 'zigbee2mqtt/bridge/request/permit_join',
                    payload_template: '"{"value": true}"',
                },
            });
            return true;
        }
        default: {
            return false;
        }
        }

    }

}

export default new DeviceService();
