import { Request, Response } from 'express';

class DatabaseForwarder {
    forward(req: Request, res: Response): Promise<any> {
        return new Promise((res, rej) => {});
    }
}

export default new DatabaseForwarder();
