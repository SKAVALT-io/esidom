import { EventObserver } from '../types/observer';
import httpForwarder from '../forwarders/httpForwarder';
import socketForwarder from '../forwarders/socketForwarder';
import { Device } from '../types/device';
import {
    HaDevice,
    HaEntity,
    HaSearchDeviceResponse,
    HaStateResponse
} from '../types/haTypes';
import entityService from './entityService';

class DeviceService implements EventObserver {

    constructor() {
        socketForwarder.registerObserver(this);
    }

    onDeviceRegistryUpdated(deviceId: string): void {
        socketForwarder.forward<HaSearchDeviceResponse>({
            type: 'search/related',
            item_type: 'device',
            item_id: deviceId,
        })
            .then((device: HaSearchDeviceResponse) => {
                socketForwarder.forward<HaDevice[]>({ type: 'config/device_registry/list' })
                    .then((haDevices: HaDevice[]) => {
                        const data = haDevices
                            .filter((d: HaDevice) => d.config_entries
                                .includes(device.config_entry[0]))
                            .map((d: HaDevice) => ({
                                id: d.id,
                                name: d.name,
                                model: d.model,
                                entities: device.entity,
                                automation: device.automation,
                            }))[0];
                        console.log('DEVICE CREATED : ', data);
                        socketForwarder.emitSocket('device_created', data);
                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    }

    async getDevices(): Promise<Device[]> {
        const devices: HaDevice[] = await socketForwarder.forward({ type: 'config/device_registry/list' });
        const entities: HaEntity[] = await socketForwarder.forward({ type: 'config/entity_registry/list' });
        const states: HaStateResponse[] = await socketForwarder.forward({ type: 'get_states' });
        return devices.map((d: HaDevice) => {
            const device: Device = {
                id: d.id,
                name: d.name,
                model: d.model,
                entities: entityService.filterEntitiesByDevice(d.id, entities, states),
                automations: [],
                nameByUser: d.name_by_user ?? '',
                disabledBy: d.disabled_by ?? '',
                areaId: d.area_id ?? '',
            };
            // TODO: device.automations = populate automations
            return device;
        });
    }

    async getDeviceById(id: string) {
        const devices: Device[] = await this.getDevices();
        return devices.find((d: Device) => d.id === id);
    }

    async pairdevice(): Promise<any> {
        try {
            await httpForwarder.post<any>('/api/services/zwave/add_node', null);
        } catch (err) {
            console.log(err);
        }
        try {
            await socketForwarder.forward({
                type: 'call_service',
                domain: 'mqtt',
                service: 'publish',
                service_data: {
                    topic: 'zigbee2mqtt/bridge/request/permit_join',
                    payload_template: '"{"value": true}"',
                },
            });
        } catch (err) {
            console.log(err);
        }
    }

}

export default new DeviceService();
