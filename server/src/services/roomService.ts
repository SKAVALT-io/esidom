import httpForwarder from '../forwarders/httpForwarder';
import socketForwarder from '../forwarders/socketForwarder';
import { Room } from '../types/room';

class RoomService {

    async getRooms(): Promise<Room[]> {
        return new Promise((res, res) => {});
    }

}

export default new RoomService();
