import { Request, Response } from 'express';
import entityService from '../services/entityService';
import App from '../app';
import { Entity } from '../types/entity';
import { send, sendf } from '../utils/functions';

const NO_SUCH_ID = (id: string): string => `No entity with such id: ${id}`;

@App.rest('/entity')
class EntityController {

    @App.get('')
    async getEntities(req: Request, res: Response): Promise<Response<Entity[]>> {
        const { type } = req.query;
        return entityService.getEntities()
            .then((entities: Entity[]) => {
                const data: Entity[] = type === undefined
                    ? entities
                    : entities.filter((e: Entity) => e.type === type);
                return send(res, 200, data);
            });
    }

    @App.get('/types')
    async getEntitiesType(_req: Request, res: Response): Promise<Response<string[]>> {
        return entityService.getTypes()
            .then(sendf(res, 200));
    }

    @App.get('/:id')
    async getEntityById(req: Request, res: Response)
    : Promise<Response<Entity> | Response<{ error: string}>> {
        const { id } = req.params;
        return entityService.getEntityById(id)
            .then((entity: Entity | undefined) => (entity
                ? send(res, 200, entity)
                : send(res, 404, { error: NO_SUCH_ID(id) })));
    }

    @App.put('/:id')
    async updateEntityState(req: Request, res: Response)
    : Promise<Response<Entity> | Response<{error:string}>> {
        const { id } = req.params;
        const { service, serviceData } = req.body;
        return entityService.updateEntityState(id, service, serviceData)
            .then((entity: Entity | undefined) => (entity
                ? send(res, 200, entity)
                : send(res, 404, { error: NO_SUCH_ID(id) })));
    }

    @App.patch('/:id')
    async toggleEntity(req: Request, res: Response)
    : Promise<Response<Entity> | Response<{error:string}>> {
        const { id } = req.params;
        const { enable } = req.body;
        return entityService.toggleEntity(id, enable)
            .then((entity: Entity | undefined) => (entity
                ? send(res, 200, entity)
                : send(res, 404, { error: NO_SUCH_ID(id) })));
    }

}

export default new EntityController();
