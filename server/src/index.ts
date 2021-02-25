import { Request, Response } from 'express';
import { config } from 'dotenv';
import axios from 'axios';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import App from './app';
import deviceController from './controllers/deviceController';
import authController from './controllers/authController';
import entityController from './controllers/entityController';
import roomController from './controllers/roomController';
import automationController from './controllers/automationController';
import groupController from './controllers/groupController';
import userController from './controllers/userController';
import serviceController from './controllers/serviceController';
import healthController from './controllers/healthController';
import databaseForwarder from './forwarders/databaseForwarder';
import { logger } from './utils';

config(); // Dot env config

App.init();

App.app.get('/', (_req: Request, res: Response) => {
    res.status(200).send('Server up and running!');
});

const port: number = 3000;
App.http.listen(port, async () => {
    logger.info(`Server is listening on port ${port} !`);
});

const initDb = async () => {
    const db = await open({
        filename: './database.db',
        driver: sqlite3.Database,
    });
    databaseForwarder.setDb(db);
    logger.info('Database initialized !');
};
initDb();

const doAuth = async () => {
    try {
        await axios.get(`http://localhost:${port}/auth`);
        logger.info('Server authenticated to HA !');
    } catch (err) {
        logger.error(`ERR(${err.response.status}): ${err.response.statusText}`);
    }
};
doAuth();

// 'Instanciate' each controller
[
    deviceController, authController, entityController,
    roomController, automationController, groupController,
    userController, serviceController, healthController,
].forEach(() => {});
