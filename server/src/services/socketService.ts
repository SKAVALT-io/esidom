/* eslint-disable camelcase */
import socketForwarder from '../forwarders/socketForwarder';
import {
    HaDevice,
    HaDumbEnum,
    HaDumbType,
    HaEntity,
    HaRoom,
    HaRoomDetail,
    HaService,
    HaStateResponse,
} from '../types/haTypes';

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

    async updateEntity(id: string, name: string, enable: boolean): Promise<any> {
        return socketForwarder.forward({
            type: 'config/entity_registry/update',
            entity_id: id,
            name,
            disabled_by: (enable) ? null : 'user',
        });
    }

}

export default new SocketService();
