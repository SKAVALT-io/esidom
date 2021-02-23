import { Request, Response } from 'express';
import deviceService from '../services/deviceService';
import App from '../app';
import { Device } from '../types/device';
import { send, sendf } from '../utils/functions';

@App.rest('/device')
class DeviceController {

    @App.get('')
    async getDevices(_req: Request, res: Response): Promise<Response<Device[]>> {
        return deviceService.getDevices()
            .then(sendf(res, 200));
    }

    @App.get('/:deviceId')
    async getDevice(req: Request, res: Response)
    : Promise<Response<Device> | Response<{ error: string }>> {
        const { deviceId } = req.params;
        return deviceService.getDeviceById(deviceId)
            .then((device: Device | undefined) => {
                if (!device) {
                    return send(res, 404, { error: `No device with such id: ${deviceId}` });
                }
                return send(res, 200, device);
            });
    }

    @App.post('')
    async postDevice(_req: Request, res: Response): Promise<Response<{ message: string }>> {
        return deviceService.pairdevice()
            .then(() => send(res, 200, { message: 'pairing mode enabled' }));
    }

}

export default new DeviceController();
