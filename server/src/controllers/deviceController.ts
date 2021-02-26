import { Request, Response } from 'express';
import { PairSuccessOrFailed } from '../services/deviceService';
import App from '../app';
import { deviceService } from '../services';
import { Device } from '../types';
import {
    send, sendf, sendNoSuchId, Success, SuccessOrError,
} from '../utils';

@App.rest('/device')
class DeviceController {

    /**
     * Get all the devices
     * @returns all the devices
     */
    @App.get('')
    async getDevices(_req: Request, res: Response): Success<Device[]> {
        return deviceService
            .getDevices()
            .then(sendf(res, 200));
    }

    /**
     * Get a device by its id
     * @pathParam `id` Id of the device
     * @returns the device with the correct id, or an error
     */
    @App.get('/:deviceId')
    async getDevice(req: Request, res: Response): SuccessOrError<Device> {
        const { deviceId } = req.params;
        return deviceService
            .getDeviceById(deviceId)
            .then((device) => {
                if (!device) {
                    return sendNoSuchId(res, deviceId);
                }
                return send(res, 200, device);
            });
    }

    /**
     * Pair a new device
     * @returns a message
     */
    @App.post('')
    async postDevice(_req: Request, res: Response): Success<PairSuccessOrFailed> {
        return deviceService
            .pairDevice()
            .then(sendf(res, 200));
    }

}

export default new DeviceController();
