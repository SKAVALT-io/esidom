import { Device } from './device';

export interface User {
    id: string;
    username: string;
    admin: boolean;
    devices: Array<Device>;
}
