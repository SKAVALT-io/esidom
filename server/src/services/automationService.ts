import httpForwarder from '../forwarders/httpForwarder';
import socketForwarder from '../forwarders/socketForwarder';
import { Automation } from '../types/automation';

class AutomationService {

    async getAutomations(): Promise<Automation[]> {
        return new Promise((res, res) => {});
    }

    getAutomationById(id: number) {
        httpForwarder.get<number>(`/device/${id}`);
    }

}

export default new AutomationService();
