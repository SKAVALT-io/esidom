import { Device } from '../types/device';
import socketForwarder from '../forwarders/socketForwarder';
import { Room } from '../types/room';
import { HaRoom, HaRoomDetail } from '../types/haTypes';
import deviceService from './deviceService';

class RoomService {

    async getRooms(): Promise<Room[]> {
        const haRooms: HaRoom[] = await socketForwarder.forward({ type: 'config/area_registry/list' });
        return Promise.all(haRooms.map((r: HaRoom) => {
            const room: Room = {
                roomId: r.area_id,
                name: r.name,
                devices: [],
                automations: [],
            };
            return this.injectAutomationsDevicesIntoRoomObject(room);
        }));
    }

    async createRoom(name: string): Promise<Room> {
        const haRoom = await socketForwarder.forward<HaRoom>({ type: 'config/area_registry/create', name: `${name}` });
        const room : Room = {
            roomId: haRoom.area_id,
            name: haRoom.name,
            devices: [],
            automations: [],
        };
        return room;
    }

    private async injectAutomationsDevicesIntoRoomObject(room: Room): Promise<Room> {
        const haRoom: HaRoomDetail = await socketForwarder.forward({ type: 'search/related', item_type: 'area', item_id: room.roomId });
        if (haRoom.device !== undefined) {
            const devices = (await Promise.all(
                haRoom.device.map(async (id: string) => deviceService.getDeviceById(id)),
            ));
            room.devices.push(...devices.filter((x) => x !== undefined) as Device[]);
        }
        // TODO inject automation
        return room;
    }

    deleteRoom(roomId: string) {
        return socketForwarder.forward({ type: 'config/area_registry/delete', area_id: roomId });
    }

    async getRoomById(roomId: string): Promise<Room> {
        const rooms: Room[] = await this.getRooms();
        console.log(roomId);
        const room = rooms.find((r: Room) => r.roomId === roomId);
        if (!room) {
            throw new Error(`There are no rooms with this id : ${roomId}`);
        }
        return room;
    }

    private async updateRoomDevice(deviceId: string, areaId: string): Promise<any> {
        return socketForwarder.forward({ type: 'config/device_registry/update', device_id: deviceId, area_id: areaId });
    }

}

export default new RoomService();
