import type { Room } from '../../types/roomType';
import HttpHelper from '../utils/HttpHelper';

export default class RoomService {
    /**
     * Gets the rooms.
     */
    static async getRooms(): Promise<Room[]> {
        return HttpHelper.get<Room[]>('/room');
    }

    /**
     * Creates a room.
     * @param room the new room
     */
    static async createRoom(room: Room): Promise<Room> {
        return HttpHelper.post('/room', room);
    }

    /**
     * Deletes a room.
     * @param room the room to delete
     */
    static async deleteRoom(room: Room): Promise<void> {
        return HttpHelper.delete(`/room/${room.roomId}`);
    }

    /**
     * Updates a room.
     * @param room the room to be updated
     */
    static async updateRoom(room: Room): Promise<void> {
        return HttpHelper.put(`/room/${room.roomId}`, room);
    }
}
