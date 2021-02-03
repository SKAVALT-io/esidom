import { Request, Response } from 'express';
import { deviceService } from '../services/deviceService';
import { App } from '../app';

@App.rest('/device')
class DeviceController {
    @App.get('')
    async getDevices(req: Request, res: Response): Promise<void> {
        const result = await deviceService.getDevices();
        res.status(200).send(result);
        console.log(this);
    }
}

export default DeviceController;
