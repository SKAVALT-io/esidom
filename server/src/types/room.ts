import { Automation } from './automation';
import { Device } from './device';

export interface Room {
    roomId:string;
    name: string;
    devices: Array<Device>;
    automations: Array<Automation>;
}
