import axios, { AxiosResponse } from 'axios';
import { Entity } from '../src/types/entity';
import config from './config';

const mock: Entity = expect.objectContaining({
    id: expect.any(String),
    name: expect.any(String),
    type: expect.any(String),
    state: expect.any(String),
    attributes: expect.any(Object),
} as Entity);

const entitiesTypes: string[] = ['person', 'sun', 'group', 'zone', 'binary_sensor', 'switch', 'sensor', 'automation', 'weather', 'media_player', 'light', 'persistent_notification', 'zwave'];
const HaWeatherEntityId: string = 'weather.maison_hourly';

describe('Entity controller tests', () => {
    test('it should get entities', async () => {
        const res: AxiosResponse<any> = await axios.get(`${config.baseUrl}/entity`);
        expect(res.status).toBe(200);
        expect(res.data.length).toBeDefined();
        const { data } = res;
        data.forEach((e: any) => {
            expect(e).toMatchObject(mock);
        });
    });

    test('it should get an entity by its id', async () => {
        const res: AxiosResponse<any> = await axios
            .get(`${config.baseUrl}/entity/${HaWeatherEntityId}`);
        expect(res.status).toBe(200);
        expect(res.data).toBeDefined();
        expect(res.data).toMatchObject(mock);
    });

    test('it should return 404 when calling entityById with unknown id', async () => {
        await expect(async () => {
            await axios.get(`${config.baseUrl}/entity/notAndId`);
        }).rejects.toThrow().catch((err) => {
            expect(err).toHaveProperty('response');
            const res = err.response;
            expect(res).toHaveProperty('status');
            expect(res.status).toBe(404);
            expect(res).toHaveProperty('message');
            expect(res.message).toBe('No entity with such id');
        });
    });

    test('it should populate entities type', async () => {
        const res: AxiosResponse<any> = await axios.get(`${config.baseUrl}/entity/types`);
        expect(res.status).toBe(200);
        expect(res.data).toBeDefined();
        expect(res.data).toHaveProperty('length');
        const { data } = res;
        data.forEach((elem: string) => {
            expect(entitiesTypes).toContain(elem);
        });
    });

    test('it should enable/disable an entity', async () => {
        const res = await axios.patch(`${config.baseUrl}/entity/${HaWeatherEntityId}`, { enable: true });
        expect(res.status).toBe(200);
        expect(res.data).toMatchObject(mock);
    });
});
