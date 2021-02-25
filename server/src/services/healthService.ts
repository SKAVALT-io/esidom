import { httpService } from '.';

class HealthService {

    async getHealth(): Promise<unknown> {
        return httpService.getApiStatus();
    }

}

export default new HealthService();
