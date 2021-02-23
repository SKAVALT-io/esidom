import { Request, Response } from 'express';
import roomService from '../services/roomService';
import App from '../app';
import { Room } from '../types/room';

@App.rest('/room')
class RoomController {

    @App.get('')
    async getRooms(_req: Request, res: Response): Promise<Response<Room[]>> {
        return roomService.getRooms()
            .then((rooms) => res.status(200).send(rooms))
            // Remove this catch ?
            .catch((err) => res.status(404).send({ error: err.message }));
    }

    @App.post('')
    async createRoom(req: Request, res: Response): Promise<Response<Room>> {
        const { name } = req.body as {name: string};
        if (!name) {
            return res.status(400).send({ error: 'The parameter name is missing' });
        }

        return roomService.createRoom(name)
            .then((room) => res.status(200).send(room));
    }

    @App.get('/:roomId')
    async getRoom(req: Request, res: Response): Promise<any> {
        const { areaId } = req.params as { areaId: string };

        return roomService
            .getRoomById(areaId)
            .then((room) => {
                if (room) {
                    return res.status(200).send(room);
                }
                return res.status(404).send({ error: 'No room with such id' });
            });
    }

    @App.put('/:roomId')
    async updateRoom(req: Request, res: Response): Promise<Response<{message: string}>> {
        return res.status(200).send({ message: 'TODO' });
    }

    @App.delete('/:roomId')
    async deleteRoom(req: Request, res: Response): Promise<void> {
        const { roomId } = req.params as { roomId: string};
        
        if (!roomId) {
            return res.status(400).send({ message: 'The parameter roomId is missing' });
        }

        return roomService.deleteRoom(roomId)
            .then(() => send(res, 200, { message: 'Room successful deleted' }))
            .catch((err: any) => send(res, 400, { error: 'Error while deleting room' }));
    }

}

export default new RoomController();
