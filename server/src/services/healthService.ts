import httpForwarder from '../forwarders/httpForwarder';
import socketForwarder from '../forwarders/socketForwarder';
import { HaStateResponse } from '../types/haTypes';

class HealthService {

    async getHealth() {
        return httpForwarder.get('/api', { timeout: 10000 });
    }

}

export default new HealthService();
