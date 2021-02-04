import { Request, Response } from 'express';
import deviceService from '../services/deviceService';
import App from '../app';

@App.rest('/device')
class DeviceController {

    @App.get('')
    async getDevices(req: Request, res: Response): Promise<void> {
        const result = await deviceService.getDevices();
        res.status(200).send(result);
    }

    @App.get('/:deviceId')
    async getDevice(req: Request, res: Response): Promise<void> {
        const result = await deviceService.getDeviceById(req.params.deviceId);
        res.status(200).send(result);
    }

}

export default new DeviceController();
