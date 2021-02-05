import socketForwarder from '../forwarders/socketForwarder';
import { Entity } from '../types/entity';
import { HaEntity, HaStateResponse } from '../types/haTypes';

class EntityService {

    async getEntities(): Promise<Entity[]> {
        const entities: HaEntity[] = await socketForwarder
            .forward({ type: 'config/entity_registry/list' });
        const states: HaStateResponse[] = await socketForwarder
            .forward({ type: 'get_states' });

        return entities.map((e: HaEntity) => {
            const entityState = states
                .find((ent: HaStateResponse) => ent.entity_id === e.entity_id);
            const { attributes } = entityState ?? {};
            const state = entityState?.state ?? '';
            const entity: Entity = {
                id: e.entity_id,
                name: e.name,
                type: e.entity_id.split('.')[0],
                attributes,
                state,
            };
            return entity;
        });
    }

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

    async getEntityById(id: string) {
        const entities = await this.getEntities();
        return entities.find((e: Entity) => e.id === id);
    }

    async updateEntityState(id: string, service: string, serviceData: any = {}) {
        // const entity: Entity | undefined = await this.getEntityById(id);
        // console.log(entity);
        // if (entity === undefined) {
        //     return entity;
        // }
        const res = await socketForwarder.forward<any>({
            type: 'call_service',
            domain: service.split('.')[0],
            service: service.split('.')[1],
            service_data: { entity_id: id, ...serviceData },
        });
        console.log(res);
        return res;
    }

}

export default new EntityService();
