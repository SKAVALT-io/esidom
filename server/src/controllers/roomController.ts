import { Request, Response } from 'express';
import roomService from '../services/roomService';
import App from '../app';

@App.rest('/room')
class RoomController {

    @App.get('')
    async getRooms(req: Request, res: Response): Promise<void> {
        try {
            const result = await roomService.getRooms();
            res.status(200).send(result);
        } catch (err) {
            res.status(404).send({ message: err });
        }
    }

    @App.post('')
    async createRoom(req: Request, res: Response): Promise<void> {
        if (req.body.name === undefined || req.body.name === '') {
            res.status(400).send({ message: 'The parameter name is missing' });
            return;
        }
        try {
            const result = await roomService.createRoom(req.body.name);
            res.status(200).send(result);
        } catch (err) {
            res.status(404).send({ message: err });
        }
    }

    @App.get('/:roomId')
    async getRoom(req: Request, res: Response): Promise<void> {
        const areaId = req.params.roomId;
        try {
            const result = await roomService.getRoomById(areaId);
            const code = result ? 200 : 404;
            const data = result ?? { message: 'No room with such id' };
            res.status(code).send(data);
        } catch (err) {
            res.status(404).send({ message: err });
        }
    }

    @App.put('/:roomId')
    async updateRoom(req: Request, res: Response): Promise<void> {
        res.status(200).send({ message: 'TODO' });
    }

    @App.delete('/:roomId')
    async deleteRoom(req: Request, res: Response): Promise<void> {
        const areaId = req.params.roomId;
        if (req.params.roomId === undefined || req.params.roomId === '') {
            res.status(400).send({ message: 'The parameter roomId is missing' });
            return;
        }
        const result = await roomService.deleteRoom(areaId).catch(() => undefined);
        if (result === undefined) {
            res.status(400).send({ message: 'Error while delete room' });
            return;
        }
        res.status(200).send({ message: 'Room successful deleted' });
    }

}

export default new RoomController();
