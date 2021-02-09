import httpForwarder from '../forwarders/httpForwarder';
import { Automation } from '../types/automation';

class AutomationService {

    async getAutomations(): Promise<Automation[]> {
        return new Promise(() => {});
    }

    getAutomationById(id: number) {
        httpForwarder.get<number>(`/device/${id}`);
    }

}

export default new AutomationService();
