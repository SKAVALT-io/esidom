import { Device } from '../types/device';
import httpForwarder from '../forwarders/httpForwarder';
import socketForwarder from '../forwarders/socketForwarder';

class DeviceService {

    async getDevices(): Promise<Device[]> {
        const states = await socketForwarder.forward({ type: 'get_states' });
        return states.filter((x: any) => ['person', 'sun', 'zone', 'weather', 'device_tracker', 'automation']
            .indexOf(x.entity_id.split('.')[0]) === -1);
    }

    getDeviceById(id: number) {
        httpForwarder.get<number>(`/device/${id}`);
    }

}

export default new DeviceService();
