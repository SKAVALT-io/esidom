import type { Room } from '../../types/roomType';
import http from '../utils/HttpHelper';
import { tr } from '../utils/i18nHelper';
import toastService from '../utils/toast';

export default class RoomService {
    static async getRooms(): Promise<Room[]> {
        return http.get<Room[]>('/room')
            .then((rooms) => rooms)
            .catch(() => {
                toastService.toast(tr('rooms.errorWhileLoading'), 'error');
                return [];
            });
    }

    static async createRoom(room: Room): Promise<Room> {
        return http.post<Room, Room>('/room', room)
            .then((r) => r)
            .catch(() => {
                toastService.toast(tr('rooms.errorWhileCreating'), 'error');
                return room;
            });
    }

    static async deleteRoom(room: Room): Promise<void> {
        return http.delete<void, Room>(`/room/${room.roomId}`)
            .catch(() => {
                toastService.toast(tr('rooms.errorWhileDeleting'), 'error');
            });
    }

    static async updateRoom(room: Room): Promise<void> {
        return http.put<void, Room>(`/room/${room.roomId}`, room)
            .catch(() => {
                toastService.toast(tr('rooms.errorWhileDeleting'), 'error');
            });
    }
}
