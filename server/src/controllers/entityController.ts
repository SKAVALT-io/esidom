import { Request, Response } from 'express';
import entityService from '../services/entityService';
import App from '../app';
import { Entity } from '../types/entity';

@App.rest('/entity')
class EntityController {

    @App.get('')
    async getEntities(req: Request, res: Response): Promise<void> {
        try {
            const result = await entityService.getEntities();
            res.status(200).send(result);
        } catch (err) {
            res.status(404).send({ message: err });
        }
    }

    @App.get('/:id')
    async getEntityById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const result: Entity | undefined = await entityService.getEntityById(id);
            const code: number = result ? 200 : 404;
            const data: Entity | any = result || { message: 'No entity with such id' };
            res.status(code).send(data);
        } catch (err) { // TODO: define error handling
            res.status(404).send({ message: err });
        }
    }

    @App.put('/:id')
    async updateEntityState(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { service, serviceData } = req.body;
            console.log(`${id} ${service} ${serviceData}`);
            const result: Entity | undefined = await entityService
                .updateEntityState(id, service, serviceData);
            res.status(200).send(result);
        } catch (err) {
            res.status(404).send(err);
        }
    }

}

export default new EntityController();
