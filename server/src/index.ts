import { Request, Response } from 'express';
import App from './app';
import deviceController from './controllers/deviceController';
import authController from './controllers/authController';

require('dotenv').config();

const port: number = 3000;

App.init();

App.app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Server up and running!');
});

App.http.listen(port, () => {
    console.log('App is listening on port 3000 !');
});

const controllers = [deviceController, authController];
