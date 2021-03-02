import { HaService, Service } from '../types';
import { entityService, socketService } from '.';

class ServiceService {

    async getServices(): Promise<Service[]> {
        const domains: string[] = await entityService.getTypes();
        const haServices: HaService = await socketService.getServices();
        const services: Service[] = [];
        Object.keys(haServices).forEach((domain) => {
            if (domains.indexOf(domain) === -1) {
                return;
            }
            Object.keys(haServices[domain]).forEach((service) => {
                services.push({
                    name: `${domain}.${service}`,
                    fields: Object.keys(haServices[domain][service].fields),
                });
            });
        });
        return services;
    }

}

export default new ServiceService();
