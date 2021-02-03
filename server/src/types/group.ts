import { Device } from './device';

export interface Group {
    groupId: string;
    name: string;
    devices: Array<Device>;
}
