import { EventObserver } from '../types/observer';
import socketForwarder from '../forwarders/socketForwarder';
import { Device } from '../types/device';
import {
    HaDevice,
    HaEntity,
    HaSearchDeviceResponse,
    HaStateResponse,
} from '../types/haTypes';
import entityService from './entityService';
import socketService from './socketService';
import httpService from './httpService';

class DeviceService implements EventObserver {

    constructor() {
        socketForwarder.registerObserver(this);
    }

    onDeviceRegistryUpdated(deviceId: string): void {
        socketService.searchDeviceById(deviceId)
            .then((device: HaSearchDeviceResponse) => {
                socketService.listDeviceRegistry()
                    .then((haDevices: HaDevice[]) => {
                        const data = haDevices
                            .filter((d: HaDevice) => d
                                // TODO: it may not be the correct device,
                                // because we filter on the config_entry attribute,
                                // and multiple devices can share a similar config_entry.
                                .config_entries.sort().toString()
                                === device.config_entry.sort().toString()) // VALIDATE THIS WORKS
                            .map((d: HaDevice) => ({
                                id: d.id,
                                name: d.name,
                                model: d.model,
                                entities: device.entity,
                                automation: device.automation,
                            }))[0];
                        console.log('DEVICE CREATED : ', data);
                        socketForwarder.emitSocket('device_created', data);
                    });
            })
            .catch((err) => socketForwarder.emitSocket('device_created', { error: err.message }));
    }

    async getDevices(): Promise<Device[]> {
        const devices: HaDevice[] = await socketService.listDeviceRegistry();
        const entities: HaEntity[] = await socketService.listEntityRegistry();
        const states: HaStateResponse[] = await socketService.getStates();
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

    async getDeviceById(id: string): Promise<Device | undefined> {
        const devices: Device[] = await this.getDevices();
        return devices.find((d: Device) => d.id === id);
    }

    async pairdevice() {
        await httpService.enableZWavePairing()
            .catch((err) => {
                console.log(err.message);
                throw err;
            });
        await socketService.callService(
            'mqtt',
            'publish',
            {
                topic: 'zigbee2mqtt/bridge/request/permit_join',
                payload_template: 'true',
            },
        ).catch((err) => {
            console.log(err.message);
            throw err;
        });
    }

}

export default new DeviceService();
