import { Request, Response } from 'express';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

class DatabaseForwarder {

    db: Database<sqlite3.Database, sqlite3.Statement> | undefined;

    constructor() {
        sqlite3.verbose();
        open({
            filename: './src/db/database.db',
            driver: sqlite3.Database,
        }).then((db) => {
            this.db = db;
        }).catch((err) => {
            console.log(err);
        });
    }

    // eslint-disable-next-line no-unused-vars
    forward(request: Request, response: Response): Promise<any> {
        // eslint-disable-next-line no-unused-vars
        return new Promise((res, rej) => {});
    }

}

export default new DatabaseForwarder();
