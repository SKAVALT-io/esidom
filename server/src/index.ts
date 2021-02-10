import { Request, Response } from 'express';
import { config } from 'dotenv';
import axios, { AxiosResponse } from 'axios';
import App from './app';
import deviceController from './controllers/deviceController';
import authController from './controllers/authController';
import entityController from './controllers/entityController';
import roomController from './controllers/roomController';
import automationController from './controllers/automationController';
import groupController from './controllers/groupController';
import userController from './controllers/userController';

config(); // Dot env config

App.init();

App.app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Server up and running!');
});

const port: number = 3001;
App.http.listen(port, async () => {
    console.log(`App is listening on port ${port} !`);
});

const doAuth = async () => {
    const { status } = await axios
        .get(`http://localhost:${port}/auth`) as AxiosResponse<any>;
    if (status !== 200) {
        throw new Error('Unable to authenticate server to HA');
    }
    console.log('Server authenticated to HA !');
};
doAuth();

// 'Instanciate' each controller
[
    deviceController, authController, entityController,
    roomController, automationController, groupController, userController,
].forEach(() => {});
