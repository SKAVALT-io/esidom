import { socketForwarder } from '../forwarders';
import { entityService, socketService } from '.';
import {
    Device,
    EventObserver,
    HaDevice,
    HaEntity,
    HaSearchDeviceResponse,
    HaStateResponse,
} from '../types';
import { logger } from '../utils';
import httpService from './forwarderServices/httpService';

type PairStatus = {status: string } | {status: 'failed', error: string};
export type PairSuccessOrFailed = {[protocol: string]: PairStatus}

class DeviceService implements EventObserver {

    constructor() {
        socketForwarder.registerObserver(this);
    }

    /* Start inherited from EventObserver */
    onDeviceCreated(id: string): void {
        setTimeout(() => {
            socketService.searchDeviceById(id)
                .then(async (device: HaSearchDeviceResponse) => {
                    await socketService.listDeviceRegistry()
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
                                    entities: entityService.filterUnwantedEntities2(device.entity),
                                    automation: device.automation,
                                }))[0];
                            socketForwarder.emitSocket('deviceCreated', data);
                        });
                })
                .catch((err) => socketForwarder.emitSocket('deviceCreated', { error: err.message }));
        }, 2000);
    }

    onDeviceUpdated(id: string): void {
        logger.warn(`Received event 'device ${id} updated', but forwarding to the client is not implemented yet`);
    }

    onDeviceRemoved(id: string): void {
        logger.warn(`Received event 'device ${id} removed', but forwarding to the client is not implemented yet`);
    }
    /* End inherited from EventObserver */

    /**
     * Get all the devices
     * @returns all the devices
     */
    async getDevices(): Promise<Device[]> {
        const devices: HaDevice[] = await socketService.listDeviceRegistry();
        const entities: HaEntity[] = await socketService.listEntityRegistry();
        const states: HaStateResponse[] = await socketService.getStates();
        return Promise.all(
            devices.map(async (d: HaDevice) => {
                const device: Device = {
                    id: d.id,
                    name: d.name,
                    model: d.model,
                    entities: (await entityService.filterEntitiesByDevice(d.id, entities, states)),
                    automations: [],
                    nameByUser: d.name_by_user ?? '',
                    disabledBy: d.disabled_by ?? '',
                    areaId: d.area_id ?? '',
                };
                // TODO: device.automations = populate automations
                return device;
            }),
        );
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

    async pairZwave(): Promise<PairStatus> {
        return httpService
            .enableZWavePairing()
            .then(() => ({ status: 'ok' }))
            .catch((err:{message: string}) => ({ status: 'failed', error: err.message }));
    }

    async pairZigbee() : Promise<PairStatus> {
        return socketService
            .callService('mqtt', 'publish', {
                topic: 'zigbee2mqtt/bridge/request/permit_join',
                payload_template: '{"value": true, "time": 120}', // timeout of 120s according front app
            })
            .then(() => ({ status: 'ok' }))
            .catch((err:{message: string}) => ({ status: 'failed', error: err.message }));
    }

    /**
     * Pair a new device
     */
    async pairDevice(): Promise<PairSuccessOrFailed> {
        return {
            zwave: await this.pairZwave(),
            zigbee: await this.pairZigbee(),
        };
    }

}

export default new DeviceService();
