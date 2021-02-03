import express from 'express';
import { createServer } from "http";

export class App {
    static app = express();
    static http = createServer(App.app);

    static init() {
        App.app.use(express.json());
        App.app.use(express.urlencoded({extended: true}));
        App.app.use(function (req, res, next) {
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

    static rest: (name: string) => ClassDecorator = name => (target: Function) => {
        App.restPathMap.get(target.name)?.forEach(element => {
            element(name);
        });
    }

    static get = (path: string) => (targetClass: Object, name: string, descriptor: PropertyDescriptor) => {
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

    // static post = (path: string) => (targetClass: Function, name: string, descriptor: PropertyDescriptor) => {
    //     const base = App.restPathMap.get(targetClass);
    //     console.log(`POST: ${base + path}`);
    //     App.app.post(base + path, (req, res) => {
    //         descriptor.value(req, res);
    //     });
    // }

    // static put = (path: string) => (targetClass: Function, name: string, descriptor: PropertyDescriptor) => {
    //     const base = App.restPathMap.get(targetClass);
    //     console.log(`PUT: ${base + path}`);
    //     App.app.put(base + path, (req, res) => {
    //         descriptor.value(req, res);
    //     });
    // }

    // static delete = (path: string) => (targetClass: Function, name: string, descriptor: PropertyDescriptor) => {
    //     const base = App.restPathMap.get(targetClass);
    //     console.log(`DELETE: ${base + path}`);
    //     App.app.delete(base + path, (req, res) => {
    //         descriptor.value(req, res);
    //     });
    // }

    // static patch = (path: string) => (targetClass: Function, name: string, descriptor: PropertyDescriptor) => {
    //     const base = App.restPathMap.get(targetClass);
    //     console.log(`PATCH: ${base + path}`);
    //     App.app.patch(base + path, (req, res) => {
    //         descriptor.value(req, res);
    //     });
    // }

}
