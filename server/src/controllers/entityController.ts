import { Request, Response } from 'express';
import entityService from '../services/entityService';
import App from '../app';

@App.rest('/entity')
class EntityController {
    @App.get('')
    async getEntities(req: Request, res: Response): Promise<void> {
        const result = await entityService.getEntities();
        res.status(200).send(result);
        console.log(this);
    }
}

export default new EntityController();
