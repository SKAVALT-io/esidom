import { socketForwarder } from '../forwarders';
import { socketService } from '.';
import {
    EventObserver, Event, Entity, HaEntity, HaStateResponse,
    MAX_RETRIEVE_ATTEMPTS,
    User,
} from '../types';
import { logger } from '../utils';

const UNWANTED_TYPES = ['person', 'zone', 'weather', 'media_player', 'persistent_notification', 'zwave'];
const UNWANTED_SUFFIXES = ['_power_status', '_update_available',
    '_linkquality', '_update_state', 'power_management', 'sourcenodeid',
    '_power_on_behavior', '_alarm_level', '_alarm_type', 'binary_sensor.updater'];

class EntityService implements EventObserver {

    constructor() {
        socketForwarder.registerObserver(this);
    }

    /* Start inherited from EventObserver */
    onEntityUpdated(id: string): void {
        this.retrieveAndEmit(id, 'entityUpdated');
    }

    onEntityCreated(id: string): void {
        this.retrieveAndEmit(id, 'entityCreated');
    }

    /**
     * Retrieves the entity matching the given entityId and send it via websocket
     * @param entityId id of the entity to retrieve
     * @param event kind of weksocket event to send on
     */
    private retrieveAndEmit(id: string, event: Event, nbRec: number = 0): void {
        this.getEntityById(id)
            .then((updated: Entity | undefined) => {
                if (updated) {
                    socketForwarder.emitSocket(event, updated);
                    return;
                }
                if (nbRec < MAX_RETRIEVE_ATTEMPTS) {
                    setTimeout(() => {
                        // eslint-disable-next-line no-param-reassign
                        this.retrieveAndEmit(id, event, nbRec++);
                    }, 2000);
                } else {
                    const error = `Unable to retrieve updated entity: ${id}`;
                    logger.error(error);
                    throw new Error(error);
                }
            })
            .catch((err) => socketForwarder
                .emitSocket(event, { error: err.message }));
    }

    /* End inherited from EventObserver */

    /**
     * Get all entities from HA
     */
    async getEntities(user?: User): Promise<Entity[]> {
        const entities = await socketService.listEntityRegistry();
        const states = await socketService.getStates();
        return this.filterUnwantedEntities(
            states.map((e: HaStateResponse) => {
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
            }),
            user,
        );
    }

    /**
     * Filter entities by their associated device
     * @param id device id
     * @param entities list of entities to be filtered
     * @param states result of a get_states WS request
     * @returns Array of filtered entities
     */
    async filterEntitiesByDevice(id: string, entities: HaEntity[],
        states: HaStateResponse[]): Promise<Entity[]> {
        // entities and states are provided to prevent multiple requests on HA
        // when iterating over an array
        const res = entities
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
        return this.filterUnwantedEntities(res);
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
            .then((states) => states
                .map((s) => s.entity_id.split('.')[0])
                .filter((t) => !UNWANTED_TYPES.some((type) => t === type)));
    }

    async updateEntity(id: string, name: string) {
        const entity: Entity | undefined = await this.getEntityById(id);
        if (entity === undefined) {
            return undefined;
        }
        await socketService.updateEntity(entity.id, name);
        return this.getEntityById(id);
    }

    private async filterUnwantedEntities(entities: Entity[], user?: User): Promise<Entity[]> {
        const result = entities
            .filter((e) => !UNWANTED_SUFFIXES.some((name) => e.id.endsWith(name))
                && !UNWANTED_TYPES.some((type) => e.type === type)
                && (user ? user.entities.includes(e.id) : true));
        return result;
    }

    // TODO Change this
    filterUnwantedEntities2(entities: string[]): string[] {
        return entities.filter((e) => !UNWANTED_SUFFIXES.some((name) => e.endsWith(name)));
    }

}

export default new EntityService();
