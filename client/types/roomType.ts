import type { Automation } from './automationType';
import type { Device } from './deviceType';

export interface Room {
    roomId:string;
    name: string;
    devices: Array<Device>;
    automations: Array<Automation>;
}
