import { Request, Response } from 'express';
import roomService from '../services/roomService';
import App from '../app';
import { Room } from '../types/room';
import {
    send,
    sendf,
    MISSING_PARAM,
    NO_SUCH_ID,
} from '../utils/functions';

@App.rest('/room')
class RoomController {

    @App.get('')
    async getRooms(_req: Request, res: Response)
    : Promise<Response<Room[]>> {
        return roomService.getRooms()
            .then(sendf(res, 200));
    }

    @App.post('')
    async createRoom(req: Request, res: Response)
    : Promise<Response<Room> | Response<{error:string}>> {
        const { name } = req.body;
        if (!name) {
            return send(res, 400, { error: MISSING_PARAM(('name')) });
        }
        return roomService.createRoom(name)
            .then((room) => send(res, 200, room));
    }

    @App.get('/:roomId')
    async getRoom(req: Request, res: Response)
    : Promise<Response<Room> | Response<{error:string}>> {
        const { areaId } = req.params;

        return roomService
            .getRoomById(areaId)
            .then((room) => {
                if (room) {
                    return send(res, 200, room);
                }
                return send(res, 404, { error: NO_SUCH_ID(areaId) });
            });
    }

    @App.put('/:roomId')
    async updateRoom(_req: Request, res: Response): Promise<Response<{message: string}>> {
        return send(res, 200, { message: 'TODO' });
    }

    @App.delete('/:roomId')
    async deleteRoom(req: Request, res: Response)
    : Promise<Response<{message: string}> | Response<{error:string}>> {
        const { roomId } = req.params;
        if (!roomId) {
            return send(res, 400, { error: MISSING_PARAM('roomId') });
        }

        return roomService.deleteRoom(roomId)
            .then(() => send(res, 200, { message: 'Room successfully deleted' }))
            .catch((err: any) => send(res, 400, {
                error: `Error while deleting room ${roomId}: ${err.message}`,
            }));
    }

}

export default new RoomController();
