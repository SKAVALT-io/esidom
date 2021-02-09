import axios from 'axios';
import { Device } from '../src/types/device';

describe('Device controller test', () => {
    test('it should get devices', async () => {
        const devices: Device[] = await axios.get('http://localhost:3000/device');
        expect(devices).toBeDefined();
    });
});
