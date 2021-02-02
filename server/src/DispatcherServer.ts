import http from 'http';
import express = require('express');
import NativeManager = require('./managers/NativeManager');
import HttpManager = require('./managers/HttpManager');

class DispatcherServer {
    private readonly app: express.Application = express();

    private readonly httpServer: http.Server = http.createServer(this.app);

    private readonly nativeManager = new NativeManager();

    private readonly httpManager = new HttpManager();

    start() {
        this.httpServer.listen(3000, () => {
            console.log('Server running');
        });
    }
}

export = DispatcherServer;
