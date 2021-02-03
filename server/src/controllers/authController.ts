import axios from 'axios';
import FormData from 'form-data';
import { Request, Response } from 'express';
import { App } from '../app';
import { config } from '../config/config';
import { socketForwarder } from '../forwarders/socketForwarder';

@App.rest('/auth')
class AuthController {
    @App.get('')
    async doAuth(req: Request, res: Response) {
        const baseUrl = req.params.baseUrl || `http://${config.baseUrl}`;
        const username = req.params.username || config.username;
        const password = req.params.password || config.password;
        console.log(this, baseUrl, username, password);
        const accessToken = await AuthController.auth(baseUrl, username, password);
        socketForwarder.initSocket(accessToken);
    }

    static async auth(baseUrl: string, username: string, password: string): Promise<string> {
        let res: any = await axios.post(`${baseUrl}/auth/login_flow`, {
            client_id: `${baseUrl}/`,
            handler: ['homeassistant', null],
            redirect_uri: `${baseUrl}/?auth_callback=1`,
        });
        const flowId = res.data.flow_id;
        console.log(flowId);
        res = await axios.post(
            `${baseUrl}/auth/login_flow/${flowId}`,
            {
                username,
                password,
                client_id: `${baseUrl}/`,
            },
        );
        const resultData: string = res.data.result;
        const bodyFormData: FormData = new FormData();
        bodyFormData.append('code', resultData);
        bodyFormData.append('client_id', `${baseUrl}/`);
        bodyFormData.append('grant_type', 'authorization_code');
        res = await axios.post(
            `${baseUrl}/auth/token`,
            bodyFormData,
            { headers: { ...bodyFormData.getHeaders() } },
        );
        const accessToken: string = res.data.access_token;
        return accessToken;
    }
}

export default AuthController;
