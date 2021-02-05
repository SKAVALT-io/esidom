import express from 'express';
import { createServer } from 'http';

export default class App {

    private static isInit = false;

    static app = express();

    static http = createServer(App.app);

    static init() {
        App.app.use(express.json());
        App.app.use(express.urlencoded({ extended: true }));
        App.app.use((req, res, next) => {
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

    // Create get annotation
    static get: (path: string) => MethodDecorator =
    (path: string) => (targetClass: Object,
        name: string | symbol, descriptor: PropertyDescriptor) => {
        const className = targetClass.constructor.name;
        const arr = App.restPathMap.get(className) ?? [];
        arr.push((base: string) => {
            console.log(`GET: ${base + path}`);
            App.app.get(base + path, (req, res) => {
                descriptor.value(req, res);
            });
        });
        App.restPathMap.set(className, arr);
        return descriptor;
    }

    // Create post annotation
    static post: (path: string) => MethodDecorator =
    (path: string) => (targetClass: Object,
        name: string | symbol, descriptor: PropertyDescriptor) => {
        const className = targetClass.constructor.name;
        const arr = App.restPathMap.get(className) ?? [];
        arr.push((base: string) => {
            console.log(`POST: ${base + path}`);
            App.app.post(base + path, (req, res) => {
                descriptor.value(req, res);
            });
        });
        App.restPathMap.set(className, arr);
        return descriptor;
    }

    // Create put annotation
    static put: (path: string) => MethodDecorator =
    (path: string) => (targetClass: Object,
        name: string | symbol, descriptor: PropertyDescriptor) => {
        const className = targetClass.constructor.name;
        const arr = App.restPathMap.get(className) ?? [];
        arr.push((base: string) => {
            console.log(`PUT: ${base + path}`);
            App.app.put(base + path, (req, res) => {
                descriptor.value(req, res);
            });
        });
        App.restPathMap.set(className, arr);
        return descriptor;
    }

    // Create patch annotation
    static patch: (path: string) => MethodDecorator =
    (path: string) => (targetClass: Object,
        name: string | symbol, descriptor: PropertyDescriptor) => {
        const className = targetClass.constructor.name;
        const arr = App.restPathMap.get(className) ?? [];
        arr.push((base: string) => {
            console.log(`PATCH: ${base + path}`);
            App.app.patch(base + path, (req, res) => {
                descriptor.value(req, res);
            });
        });
        App.restPathMap.set(className, arr);
        return descriptor;
    }

    // Create delete annotation
    static delete: (path: string) => MethodDecorator =
    (path: string) => (targetClass: Object,
        name: string | symbol, descriptor: PropertyDescriptor) => {
        const className = targetClass.constructor.name;
        const arr = App.restPathMap.get(className) ?? [];
        arr.push((base: string) => {
            console.log(`DELETE: ${base + path}`);
            App.app.delete(base + path, (req, res) => {
                descriptor.value(req, res);
            });
        });
        App.restPathMap.set(className, arr);
        return descriptor;
    }

}
