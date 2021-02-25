import { Request, Response } from 'express';
import App from '../app';
import { entityService } from '../services';
import { Entity } from '../types';
import {
    send, sendf, Success, SuccessOrError, sendNoSuchId,
} from '../utils';

@App.rest('/entity')
class EntityController {

    /**
     * Get all entities
     * @queryParam `type` The type of entity
     */
    @App.get('')
    async getEntities(req: Request, res: Response): Success<Entity[]> {
        const { type } = req.query;
        return entityService
            .getEntities()
            .then((entities) => {
                const data = type === undefined
                    ? entities
                    : entities.filter((e) => e.type === type);
                return send(res, 200, data);
            });
    }

    /**
     * Get all the entity types
     */
    @App.get('/types')
    async getEntitiesType(_req: Request, res: Response): Success<string[]> {
        return entityService
            .getTypes()
            .then(sendf(res, 200));
    }

    /**
     * Get an entity by its id
     * @pathParam `id` id of the entity
     * @returns The entity, or an error
     */
    @App.get('/:id')
    async getEntityById(req: Request, res: Response): SuccessOrError<Entity> {
        const { id } = req.params;
        return entityService
            .getEntityById(id)
            .then((entity) => (entity
                ? send(res, 200, entity)
                : sendNoSuchId(res, id)));
    }

    /**
     * Update an entity
     * @pathParam `id` id of the entity
     * @bodyParam `service` the service on which the change will be applied
     * @bodyParam `serviceData` a collection of attributes to change
     * @returns The updated entity, or an error
     */
    @App.put('/:id')
    async updateEntityState(req: Request, res: Response): SuccessOrError<Entity> {
        const { id } = req.params;
        const { service, serviceData } = req.body;
        return entityService
            .updateEntityState(id, service, serviceData)
            .then((entity) => (entity
                ? send(res, 200, entity)
                : sendNoSuchId(res, id)));
    }

    /**
     * Update entity name by its id
     * @pathParam `id` id of the entity
     * @bodyParam `name` string to define the new name of the entity
     * @returns The updated entity, or an error
     */
    @App.patch('/update/:id')
    async updateEntity(req: Request, res: Response): SuccessOrError<Entity> {
        const { id } = req.params;
        const { name } = req.body;
        return entityService.updateEntity(id, name)
            .then((entity) => (entity
                ? send(res, 200, entity)
                : sendNoSuchId(res, id)));
    }

    /**
     * Toggle an entity by its id
     * @pathParam `id` id of the entity
     * @bodyParam `enable` boolean to define it the entity should be enabled or disabled
     * @returns The toggled entity, or an error
     */
    @App.patch('/:id')
    async toggleEntity(req: Request, res: Response): SuccessOrError<Entity> {
        const { id } = req.params;
        const { enable } = req.body;
        return entityService
            .toggleEntity(id, enable)
            .then((entity) => (entity
                ? send(res, 200, entity)
                : sendNoSuchId(res, id)));
    }

}

export default new EntityController();
