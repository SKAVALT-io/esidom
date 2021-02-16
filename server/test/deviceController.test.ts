import axios, { AxiosResponse } from 'axios';
import { Device } from '../src/types/device';
import config from './config';

const mock: Device = expect.objectContaining({
    id: expect.any(String),
    model: expect.any(String),
    name: expect.any(String),
    automations: expect.any(Array),
    nameByUser: expect.any(String),
    areaId: expect.any(String),
    disabledBy: expect.any(String),
} as Device);

const HaWeatherDeviceId = '45eb8f705b20fa1df358c7d22d8ffaf8';

describe('Device controller test', () => {
    test('it should get devices', async () => {
        const res: AxiosResponse<any> = await axios.get(`${config.baseUrl}/device`);
        expect(res.status).toBe(200);
        expect(res.data.length).toBeDefined();
        const { data } = res;
        data.forEach((e: any) => {
            expect(e).toMatchObject(mock);
        });
    });

    test('it should get a device by id', async () => {
        const res: AxiosResponse<any> = await axios
            .get(`${config.baseUrl}/device/${HaWeatherDeviceId}`);
        expect(res.status).toBe(200);
        expect(res.data).toBeDefined();
        expect(res.data).toMatchObject(mock);
    });

    test('it should return 404 when calling deviceById with unknown id', async () => {
        await expect(async () => {
            await axios.get(`${config.baseUrl}/device/notAndId`);
        }).rejects.toThrow().catch((err) => {
            expect(err).toHaveProperty('response');
            const res = err.response;
            expect(res).toHaveProperty('status');
            expect(res.status).toBe(404);
            expect(res).toHaveProperty('message');
            expect(res.message).toBe('No device with such id');
        });
    });
});
