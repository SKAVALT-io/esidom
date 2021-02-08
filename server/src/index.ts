import { Request, Response } from 'express';
import { config } from 'dotenv';
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

const port: number = 3000;
App.http.listen(port, () => {
    console.log('App is listening on port 3000 !');
});

// Instanciat each controller
[
    deviceController, authController, entityController,
    roomController, automationController, groupController, userController,
].forEach(() => {});
