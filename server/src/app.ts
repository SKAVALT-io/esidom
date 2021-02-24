/* eslint-disable no-unused-vars */
import express from 'express';
import { createServer } from 'http';
import { logger } from './utils';

type HttpVerb = 'get' | 'post' | 'put' | 'patch' | 'delete';

export default class App {

    private static createDecorator(verb: HttpVerb): (path: string) => MethodDecorator {
        return (path: string) => (targetClass: Object,
            _name: string | symbol, descriptor: PropertyDescriptor) => {
            const className = targetClass.constructor.name;
            const arr = App.restPathMap.get(className) ?? [];
            arr.push((base: string) => {
                logger.info(`Registered route ${verb.toUpperCase()}: ${base + path}`);
                App.app[verb](base + path, (req, res) => {
                    logger.info(`Received request ${verb} on route ${base + path} from ${req.headers.host}`);
                    descriptor.value.call(targetClass, req, res)
                        .catch((err: any) => {
                            logger.trace(err);
                            res.status(500).send({ error: err.message });
                        });
                });
            });
            App.restPathMap.set(className, arr);
            return descriptor;
        };
    }

    private static isInit = false;

    static app = express();

    static http = createServer(App.app);

    static init() {
        App.app.use(express.json());
        App.app.use(express.urlencoded({ extended: true }));
        App.app.use((_req, res, next) => {
            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', '*');
            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            // Pass to next layer of middleware
            next();
        });
    }

    private static restPathMap = new Map<string, Array<(name: string) => void>>();

    // Create rest annotation
    static rest: (name: string) => ClassDecorator = (name) => (target: Function) => {
        if (!App.isInit) {
            App.init();
            App.isInit = true;
        }
        App.restPathMap.get(target.name)?.forEach((element) => {
            element(name);
        });
    }

    // Create the annotations
    static get = App.createDecorator('get');

    static post = App.createDecorator('post');

    static put = App.createDecorator('put');

    static patch = App.createDecorator('patch');

    static delete = App.createDecorator('delete');

}
