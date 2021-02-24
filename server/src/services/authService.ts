import { httpService } from '.';
import { socketForwarder } from '../forwarders';

class AuthService {

    async doAuth(baseUrl: string, username: string, password: string): Promise<string> {
        return this
            .auth(baseUrl, username, password)
            .then((accessToken) => {
                socketForwarder.initSocket(accessToken);
                httpService.setToken(accessToken);
                return accessToken;
            });
    }

    async auth(baseUrl: string, username: string, password: string): Promise<string> {
        let res: any = await httpService.postLoginFlow(baseUrl);
        const flowId = res.flow_id;
        res = await httpService.postFlowId(flowId, username, password, baseUrl);
        res = await httpService.postAuthToken(res.result, baseUrl);
        return res.access_token as string;
    }

}

export default new AuthService();
