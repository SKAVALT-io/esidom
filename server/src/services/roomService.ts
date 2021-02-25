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

    /**
     * Retrieve room by id
     * @param roomId
     */
    async getRoomById(roomId: string): Promise<Room | undefined> {
        const rooms: Room[] = await this.getRooms();
        return rooms.find((r: Room) => r.roomId === roomId);
    }

    /**
     * Add equipment assignment for a room
     * @param groupId Id of the equipment to add room assignment
     * @param areaId Id of the room for assignment
     */
    private async addRoomToDevice(deviceId: string, areaId: string): Promise<any> {
        return socketService.addRoomToDevice(deviceId, areaId);
    }

    /**
     * Delete equipment assignment for a room
     * @param groupId Id of the equipment to delete room assignment
     */
    private async deleteRoomToDevice(deviceId: string): Promise<any> {
        return socketService.deleteRoomToDevice(deviceId);
    }

    /**
     * Update room in HA
     * @param room room with update information
     */
    async updateRoom(room: Room): Promise<boolean> {
        const oldRoom = await this.getRoomById(room.roomId);
        if (!oldRoom) {
            return false;
        }
        const oldDevicesString = oldRoom.devices.map((d) => d.id);
        const devicesString = room.devices.map((d) => d.id);

        if (oldRoom.name !== room.name) {
            await socketService.updateRoomName(room.roomId, room.name);
        }
        await Promise.all(oldDevicesString.map((deviceId) => (
            !devicesString.includes(deviceId)
                ? this.deleteRoomToDevice(deviceId)
                : Promise.resolve()
        )));

        await Promise.all(devicesString.map((deviceId) => (
            !oldDevicesString.includes(deviceId)
                ? this.addRoomToDevice(deviceId, room.roomId)
                : Promise.resolve()
        )));

        return true;
    }

}

export default new RoomService();
