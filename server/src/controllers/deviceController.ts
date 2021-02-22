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
            res.status(404).send({ message: err.message });
        }
    }

    @App.get('/:deviceId')
    async getDevice(req: Request, res: Response): Promise<void> {
        try {
            const { deviceId } = req.params;
            const result = await deviceService.getDeviceById(deviceId);
            const code = result ? 200 : 404;
            const data = result ?? { message: `No device with id ${deviceId}` };
            res.status(code).send(data);
        } catch (err) {
            res.status(404).send({ message: err.message });
        }
    }

    @App.post('')
    async postDevice(req: Request, res: Response) {
        try {
            await deviceService.pairDevice();
            res.status(200).send({ message: 'pairing mode enabled' });
        } catch (err) {
            res.status(500).send({ message: err });
        }
    }

}

export default new DeviceController();
