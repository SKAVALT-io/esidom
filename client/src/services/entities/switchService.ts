import http from '../../utils/HttpHelper';

export default class SwitchService {
    static async switchSwitch(id: string, switchOn: boolean): Promise<unknown> {
        return http.put(`/entity/${id}`, {
            service: (switchOn ? 'switch.turn_on' : 'switch.turn_off'),
        });
    }

    static async triggerSwitch(id: string): Promise<unknown> {
        return http.put(`/entity/${id}`, { service: 'switch.turn_on' });
    }
}
