import axios, { AxiosResponse } from 'axios';
import { Automation, AutomationPreview } from '../src/types/automation';
import config from './config';

const automationPreview: AutomationPreview = {
    id: expect.any(String),
    name: expect.any(String),
    state: expect.any(String),
};

const automation: Automation = {
    id: expect.any(String),
    name: expect.any(String),
    state: expect.any(String),
    description: expect.any(String),
    mode: expect.any(String),
    action: expect.any(Array),
    condition: expect.any(Array),
    trigger: expect.any(Array),
};

const automationId = 'automation.allumer_lampe_zigbee';

describe('Automation controller test', () => {
    test('it should get automations', async () => {
        const res: AxiosResponse<any> = await axios.get(`${config.baseUrl}/automation`);
        expect(res.status).toBe(200);
        expect(res.data.length).toBeDefined();
        const { data } = res;
        data.forEach((e: any) => {
            expect(e).toMatchObject(automationPreview);
        });
    });

    test('it should get an automation by id', async () => {
        const res: AxiosResponse<any> = await axios
            .get(`${config.baseUrl}/automation/${automationId}`);
        expect(res.status).toBe(200);
        expect(res.data).toBeDefined();
        expect(res.data).toMatchObject(automation);
    });

    test('it should return 404 when calling automationById with unknown id', async () => {
        try {
            await axios.get(`${config.baseUrl}/automation/notAndId`);
            expect(true).toBeFalsy();
        } catch (err) {
            expect(err).toHaveProperty('response');
            const res = err.response;
            expect(res).toHaveProperty('status');
            expect(res.status).toBe(404);
        }
    });
});
