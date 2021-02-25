import { socketForwarder } from '../forwarders';
import { entityService, socketService, httpService } from '.';
import {
    Device,
    EventObserver,
    HaDevice,
    HaEntity,
    HaSearchDeviceResponse,
    HaStateResponse,
} from '../types';

class DeviceService implements EventObserver {

    constructor() {
        socketForwarder.registerObserver(this);
    }

    /* inherited from EventObserver */
    onDeviceRegistryUpdated(deviceId: string): void {
        setTimeout(() => { socketService.searchDeviceById(deviceId)
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
        }, 2000);
    }

    /**
     * Get all the devices
     * @returns all the devices
     */
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

    /**
     * Get a device by its id
     * @param id Id of the device
     * @returns the device with the correct id, or undefined
     */
    async getDeviceById(id: string): Promise<Device | undefined> {
        const devices: Device[] = await this.getDevices();
        return devices.find((d: Device) => d.id === id);
    }

    /**
     * Pair a new device
     */
    async pairDevice(): Promise<void> {
        await httpService.enableZWavePairing();
        await socketService.callService('mqtt', 'publish', {
            topic: 'zigbee2mqtt/bridge/request/permit_join',
            payload_template: '{"value": true, "time": 120}', // timeout of 120s according front app
        });
    }

}

export default new DeviceService();
