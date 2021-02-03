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

}

export default new RoomController();
