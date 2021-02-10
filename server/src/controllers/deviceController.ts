import { Request, Response } from 'express';
import deviceService from '../services/deviceService';
import App from '../app';

@App.rest('/device')
class DeviceController {

    @App.get('')
    async getDevices(req: Request, res: Response): Promise<void> {
        try {
            const result = await deviceService.getDevices();
            const code = result ? 200 : 404;
            const data = result ?? { message: 'No device yet :(' };
            res.status(code).send(data);
        } catch (err) {
            res.status(404).send({ message: err });
        }
    }

    @App.get('/:deviceId')
    async getDevice(req: Request, res: Response): Promise<void> {
        try {
            const result = await deviceService.getDeviceById(req.params.deviceId);
            const code = result ? 200 : 404;
            const data = result ?? { message: 'No device with such id' };
            res.status(code).send(data);
        } catch (err) {
            res.status(404).send({ message: err });
        }
    }

    @App.post('')
    async postDevice(req: Request, res: Response) {
        const result: boolean = await deviceService.pairdevice(req.body.protocol);
        if (result) {
            res.status(200).send(result);
        } else {
            res.status(404).send({ message: 'Failed to pair device' });
        }
    }

}

export default new DeviceController();
