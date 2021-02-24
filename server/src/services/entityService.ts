import { socketForwarder } from '../forwarders';
import { socketService } from '.';
import {
    EventObserver, Entity, HaEntity, HaStateResponse,
} from '../types';

class EntityService implements EventObserver {

    constructor() {
        socketForwarder.registerObserver(this);
    }

    /* Inherited from EventObserver */
    onEntityUpdated(data: string): void {
        this.getEntityById(data)
            .then((updated: Entity | undefined) => {
                if (!updated) {
                    throw new Error(`Unable to retrieve updated entity: ${data}`);
                }
                socketForwarder.emitSocket('entity_updated', updated);
            })
            .catch((err) => socketForwarder
                .emitSocket('entity_updated', { error: err.message }));
    }

    /**
     * Get all entities from HA
     */
    async getEntities(): Promise<Entity[]> {
        const entities = await socketService.listEntityRegistry();
        const states = await socketService.getStates();
        return states.map((e: HaStateResponse) => {
            const entityState = entities.find((ent: HaEntity) => ent.entity_id === e.entity_id);
            const { attributes } = e ?? {};
            const state = e?.state ?? '';
            const entity: Entity = {
                id: e.entity_id ?? '',
                name: entityState?.name ?? e.attributes?.friendly_name ?? '',
                type: e.entity_id.split('.')[0],
                attributes,
                state,
            };
            return entity;
        });
    }

    /**
     * Filter entities by their associated device
     * @param id device id
     * @param entities list of entities to be filtered
     * @param states ??
     * @returns Array of filtered entities
     */
    filterEntitiesByDevice(id: string, entities: HaEntity[], states: HaStateResponse[]): Entity[] {
        // entities and states are provided to prevent multiple requests on HA
        // when iterating over an array
        return entities
            .filter((e: HaEntity) => e.device_id === id)
            .map((e: HaEntity) => {
                const entityState = states
                    .find((ent: HaStateResponse) => ent.entity_id === e.entity_id);
                const attributes = entityState?.attributes ?? {};
                const state = entityState?.state ?? '';
                return {
                    id: e.entity_id,
                    name: e.name,
                    type: e.entity_id.split('.')[0],
                    attributes,
                    state,
                };
            });
    }

    /**
     * Get an entity by its id
     * @param id id of the entity
     */
    async getEntityById(id: string): Promise<Entity | undefined> {
        const entities = await this.getEntities();
        const result: Entity | undefined = entities
            .find((e: Entity) => e.id === id);
        return result;
    }

    /**
     * Update an entity
     * @param id id of the entity
     * @param service the service on which the change will be applied
     * @param serviceData a collection of attributes to change
     * @returns The updated entity, or undefined
     */
    async updateEntityState(id: string, service: string, serviceData: any = {})
    : Promise<Entity | undefined> {
        const splitted: string[] = service.split('.');
        if (splitted.length < 2) {
            throw new Error(`Syntax error in provided service: ${service}`);
        }
        await socketService.callService(splitted[0], splitted[1], {
            entity_id: id,
            ...serviceData,
        });
        return this.getEntityById(id);
    }

    /**
     * Toggle an entity by its id
     * @param id id of the entity
     * @param enable boolean to define it the entity should be enabled or disabled
     * @returns The toggled entity, or undefined
     */
    async toggleEntity(id: string, enable: boolean): Promise<Entity | undefined> {
        const entity = await this.getEntityById(id);
        if (!entity) {
            return undefined;
        }
        const haEnt = await socketService.updateEntity(entity.id, entity.name, enable);
        return this.getEntityById(haEnt?.entity_entry.entity_id);
    }

    /**
     * Get all the types in HA
     * @returns All the types in HA
     */
    async getTypes(): Promise<string[]> {
        return socketService
            .getStates()
            .then((states) => states.map((s) => s.entity_id.split('.')[0]));
    }

    async updateEntity(id: string, name: string) {
        const entity: Entity | undefined = await this.getEntityById(id);
        if (entity === undefined) {
            throw new Error('No entity with such id');
        }
        const body = {
            type: 'config/entity_registry/update',
            entity_id: entity.id,
            name,
        };
        await socketForwarder.forward(body);
        return this.getEntityById(id);
    }

}

export default new EntityService();
