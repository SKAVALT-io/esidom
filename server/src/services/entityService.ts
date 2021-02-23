import { EventObserver } from '../types/observer';
import socketForwarder from '../forwarders/socketForwarder';
import { Entity } from '../types/entity';
import { HaEntity, HaStateResponse } from '../types/haTypes';
import socketService from './socketService';

class EntityService implements EventObserver {

    constructor() {
        socketForwarder.registerObserver(this);
    }

    onEntityUpdated(data: string) {
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

    async getEntities(): Promise<Entity[]> {
        const entities: HaEntity[] = await socketService.listEntityRegistry();
        const states: HaStateResponse[] = await socketService.getStates();
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

    // entities and states are provided to prevent multiple requests on HA
    // when iterating over an array
    filterEntitiesByDevice(id: string,
        entities: HaEntity[], states: HaStateResponse[]): Entity[] {
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
                } as Entity;
            });
    }

    async getEntityById(id: string): Promise<Entity | undefined> {
        const entities = await this.getEntities();
        const result: Entity | undefined = entities
            .find((e: Entity) => e.id === id);
        return result;
    }

    // Returns undefined because HA doesnt send back the updated entity
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

    async toggleEntity(id: string, enable: boolean): Promise<Entity | undefined> {
        const entity: Entity | undefined = await this.getEntityById(id);
        if (!entity) {
            return undefined;
        }
        const haEnt: any = await socketService.updateEntity(entity.id, entity.name, enable);
        return this.getEntityById(haEnt?.entity_entry.entity_id);
    }

    async getTypes(): Promise<string[]> {
        const states: HaStateResponse[] = await socketService.getStates();
        const types: string[] = states
            .map((s: HaStateResponse) => s.entity_id.split('.')[0])
            .filter((val, i, array) => array.indexOf(val) === i);
        return types;
    }

}

export default new EntityService();
