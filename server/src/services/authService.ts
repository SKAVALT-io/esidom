import FormData from 'form-data';
import { Request, Response } from 'express';
import socketForwarder from '../forwarders/socketForwarder';
import httpForwarder from '../forwarders/httpForwarder';
import config from '../config/config';
import httpService from './httpService';

class AuthService {

    async doAuth(req: Request, res: Response): Promise<Response<{ token: string }>> {
        const baseUrl = req.params.baseUrl || `http://${config.baseUrl}`;
        const username = req.params.username || config.username;
        const password = req.params.password || config.password;
        try {
            const accessToken = await AuthService.auth(baseUrl, username, password);
            socketForwarder.initSocket(accessToken);
            httpForwarder.setToken(accessToken);
            return res.status(200).send({ token: accessToken });
        } catch (err) {
            return res.sendStatus(401);
        }
    }

    static async auth(baseUrl: string, username: string, password: string): Promise<string> {
        let res: any = await httpService.postLoginFlow(baseUrl);
        const flowId = res.flow_id;
        res = await httpService.postFlowId(flowId, username, password, baseUrl);
        res = await httpService.postAuthToken(res.result, baseUrl);
        const accessToken: string = res.access_token;
        return accessToken;
    }

}

export default new AuthService();
