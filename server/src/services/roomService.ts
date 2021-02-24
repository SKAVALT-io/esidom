import { socketService, deviceService } from '.';
import {
    Device, Room, HaRoom, HaRoomDetail,
} from '../types';

class RoomService {

    /**
     * Get all the rooms
     * @returns All the rooms
     */
    async getRooms(): Promise<Room[]> {
        const haRooms: HaRoom[] = await socketService.getRooms();
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
        const haRoom: HaRoom = await socketService.createRoom(name);
        const room : Room = {
            roomId: haRoom.area_id,
            name: haRoom.name,
            devices: [],
            automations: [],
        };
        return room;
    }

    private async injectAutomationsDevicesIntoRoomObject(room: Room): Promise<Room> {
        const haRoom: HaRoomDetail = await socketService.searchRoomById(room.roomId);
        if (haRoom.device) {
            const devices: Device[] = await Promise.all(
                haRoom.device.map(async (id: string) => deviceService.getDeviceById(id)),
            ).then((x) => x.filter((y): y is Device => y !== undefined));

            room.devices.push(...devices);
        }

        // TODO inject automation
        return room;
    }

    async deleteRoom(roomId: string): Promise<void> {
        return socketService.deleteRoom(roomId);
    }

    async getRoomById(roomId: string): Promise<Room | undefined> {
        const rooms: Room[] = await this.getRooms();
        return rooms.find((r: Room) => r.roomId === roomId);
    }

    private async updateRoomDevice(deviceId: string, areaId: string): Promise<any> {
        return socketService.addRoomToDevice(deviceId, areaId);
    }

}

export default new RoomService();
