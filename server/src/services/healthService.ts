import httpService from './httpService';

class HealthService {

    async getHealth(): Promise<any> {
        return httpService.getApiStatus();
    }

}

export default new HealthService();
