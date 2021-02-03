import { Request, Response } from 'express';
import { App } from './app';
import DeviceController from "./controllers/deviceController";
import AuthController from "./controllers/authController";
const port: number = 3000;

App.init();

new DeviceController();
new AuthController();
App.app.get('/', (req: Request, res: Response) => {
    res.status(200).send(`Server up and running!`)
});

App.http.listen(port, () => {
    console.log(`App is listening on port 3000 !`);
});
