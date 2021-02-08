import { Request, Response } from 'express';
import roomService from '../services/roomService';
import App from '../app';

@App.rest('/room')
class RoomController {

    @App.get('')
    async getRooms(req: Request, res: Response): Promise<void> {
        const result = await roomService.getRooms();
        res.status(200).send(result);
        console.log(this);
    }

    @App.post('')
    async createRoom(req: Request, res: Response): Promise<void> {
        if (req.body.name === undefined || req.body.name === '') {
            res.status(400).send('The parameter name is missing');
            return;
        }
        const result = await roomService.createRoom(req.body.name);
        res.status(200).send(result);
        console.log(this);
    }

}

export default new RoomController();
