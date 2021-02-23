import FormData from 'form-data';
import { HaAutomation, HaGroupSet } from '../types/haTypes';
import httpForwarder from '../forwarders/httpForwarder';

class HttpService {

    async getAutomationById(id: string): Promise<HaAutomation> {
        return httpForwarder
            .get<HaAutomation>(`/api/config/automation/config/${id}`);
    }

    async postAutomation(automation: HaAutomation): Promise<{ result?: string, message?: string}> {
        return httpForwarder
            .post(`/api/config/automation/config/${automation.id}`, automation);
    }

    async postLoginFlow(baseUrl: string): Promise<any> {
        return httpForwarder.post('/auth/login_flow', {
            client_id: `${baseUrl}/`,
            handler: ['homeassistant', null],
            redirect_uri: `${baseUrl}/?auth_callback=1`,
        });
    }

    async postFlowId(flowId: string, username: string, password: string, baseUrl: string)
    : Promise<any> {
        return httpForwarder.post(
            `/auth/login_flow/${flowId}`,
            {
                username,
                password,
                client_id: `${baseUrl}/`,
            },
        );
    }

    async postAuthToken(code: string, baseUrl: string): Promise<any> {
        const bodyFormData: FormData = new FormData();
        bodyFormData.append('code', code);
        bodyFormData.append('client_id', `${baseUrl}/`);
        bodyFormData.append('grant_type', 'authorization_code');
        return httpForwarder.post(
            '/auth/token',
            bodyFormData,
            { headers: { ...bodyFormData.getHeaders() } },
        );
    }

    async enableZWavePairing(): Promise<any> {
        return httpForwarder.post<any>('/api/services/zwave/add_node', null);
    }

    async postGroup(group: HaGroupSet): Promise<any> {
        return httpForwarder
            .post('/api/services/group/set', group);
    }

    async getApiStatus(): Promise<any> {
        return httpForwarder
            .get('/api', { timeout: 10000 });
    }

    async deleteAutomation(id: string): Promise<any> {
        return httpForwarder
            .delete(`/api/config/automation/config/${id}`);
    }

}

export default new HttpService();
