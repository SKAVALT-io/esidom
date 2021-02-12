import socketForwarder from '../forwarders/socketForwarder';
import { HaService } from '../types/haTypes';
import { Service } from '../types/service';
import entityService from './entityService';

class ServiceService {

    async getServices(): Promise<Service[]> {
        const domains: string[] = await entityService.getTypes();
        const haServices: HaService = await socketForwarder.forward({ type: 'get_services' });
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
