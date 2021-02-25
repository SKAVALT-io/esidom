import { socketForwarder } from '../../forwarders';
import {
    HaDevice,
    HaDumbEnum,
    HaDumbType,
    HaEntity,
    HaRoom,
    HaRoomDetail,
    HaSearchDeviceResponse,
    HaService,
    HaStateResponse,
} from '../../types';

class SocketService {

    async getServices(): Promise<HaService> {
        return socketForwarder.forward({ type: 'get_services' });
    }

    async getRooms(): Promise<HaRoom[]> {
        return socketForwarder.forward({ type: 'config/area_registry/list' });
    }

    async getStates(): Promise<HaStateResponse[]> {
        return socketForwarder
            .forward({ type: 'get_states' });
    }

    async callService(domain: string, service: string, data: HaDumbEnum)
    : Promise<HaDumbType> {
        return socketForwarder.forward<HaDumbType>({
            type: 'call_service',
            domain,
            service,
            service_data: data,
        });
    }

    async createRoom(name: string): Promise<HaRoom> {
        return socketForwarder
            .forward({ type: 'config/area_registry/create', name });
    }

    async searchRoomById(roomId: string): Promise<HaRoomDetail> {
        return socketForwarder
            .forward({ type: 'search/related', item_type: 'area', item_id: roomId });
    }

    async deleteRoom(roomId: string): Promise<void> {
        return socketForwarder
            .forward({ type: 'config/area_registry/delete', area_id: roomId });
    }

    async listDeviceRegistry(): Promise<HaDevice[]> {
        return socketForwarder
            .forward<HaDevice[]>({ type: 'config/device_registry/list' });
    }

    async listEntityRegistry(): Promise<HaEntity[]> {
        return socketForwarder
            .forward<HaEntity[]>({ type: 'config/entity_registry/list' });
    }

    // TODO: remove this any
    async updateEntity(id: string, name: string, enable?: boolean): Promise<any> {
        const body = {
            type: 'config/entity_registry/update',
            entity_id: id,
            name,
        // eslint-disable-next-line camelcase
        } as {type: string, entity_id: string, name: string, disabled_by: string | null};
        if (enable !== undefined) {
            body.disabled_by = (enable) ? null : 'user';
        }
        return socketForwarder.forward(body);
    }

    async addRoomToDevice(deviceId: string, areaId: string): Promise<unknown> {
        return socketForwarder.forward({
            type: 'config/device_registry/update',
            device_id: deviceId,
            area_id: areaId,
        });
    }

    async deleteRoomToDevice(deviceId: string): Promise<unknown> {
        return socketForwarder.forward({
            type: 'config/device_registry/update',
            device_id: deviceId,
            area_id: null,
        });
    }

    async searchDeviceById(id: string): Promise<HaSearchDeviceResponse> {
        return socketForwarder.forward<HaSearchDeviceResponse>({
            type: 'search/related',
            item_type: 'device',
            item_id: id,
        });
    }

    async updateRoomName(roomId: string, newName: string) {
        return socketForwarder.forward<HaRoom>({
            type: 'config/area_registry/update',
            area_id: roomId,
            name: newName,
        });
    }

}

export default new SocketService();
