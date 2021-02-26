import type { Room } from '../../types/roomType';
import HttpHelper from '../utils/HttpHelper';

export default class RoomService {
    static async getRooms(): Promise<Room[]> {
        return HttpHelper.get<Room[]>('/room');
    }

    static async createRoom(room: Room): Promise<Room> {
        return HttpHelper.post('/room', room);
    }

    static async deleteRoom(room: Room): Promise<void> {
        return HttpHelper.delete(`/room/${room.roomId}`);
    }

    static async updateRoom(room: Room): Promise<void> {
        return HttpHelper.put(`/room/${room.roomId}`, room);
    }
}
