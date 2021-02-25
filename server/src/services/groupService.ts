import { databaseForwarder, socketForwarder } from '../forwarders';
import {
    entityService, roomService, deviceService, socketService, httpService,
} from '.';
import {
    Room, Group, DBGroup, InsideGroup, Entity, EventObserver,
    Device, HaDumbType, HaGroupSet, HaStateResponse,
} from '../types';
import { logger, normalizeEntityId } from '../utils';

const GROUP_IMPLICIT_IDENTIFIER = 'imp';

class GroupService implements EventObserver {

    // Connect this services to the web socket flow
    constructor() {
        socketForwarder.registerObserver(this);
    }

    /* Start of inherited methods from EventObserver */

    onAuthOk(): void {
        this.initGroupHa();
    }

    // eslint-disable-next-line no-unused-vars
    onDeviceCreated(_id: string): void {
        // To avoid search recreate all implicit group
        this.generateImplicitGroup();
    }

    // eslint-disable-next-line no-unused-vars
    onDeviceUpdated(_id: string): void {
        // To avoid search recreate all implicit group
        this.generateImplicitGroup();
    }

    // eslint-disable-next-line no-unused-vars
    onDeviceRemoved(_id: string): void {
        // To avoid search recreate all implicit group
        this.generateImplicitGroup();
    }

    async onAreaUpdated(roomId: string): Promise<void> {
        // console.log('GPService : this.onAreaUpdated');
        const room: Room | undefined = await roomService.getRoomById(roomId);
        if (!room) {
            return;
        }
        this.generateImplicitGroupForOneRoom(room);
    }

    onAreaRemoved(roomId: string): void {
        // console.log('GPService : this.onAreaRemoved');
        this.deleteImplicitGroupForOneRoom(roomId);
    }

    /* End of inherited methods from EventObserver */

    /**
     * Initiate this service
     */
    private async initGroupHa(): Promise<void> {
        await this.loadGroupFromDb();
        await this.generateImplicitGroup();
    }

    /**
     * Load all groups from the database into HA
     */
    private async loadGroupFromDb(): Promise<void> {
        // Get all group
        const res = await databaseForwarder
            .selectAllGroups()
            .catch((err: any) => {
                logger.error(err);
                throw new Error('Unexpected database error');
            });

        await Promise.all(
            res.map(
                (g: DBGroup) => databaseForwarder.selectInsideGroupsByEntityId(g.entityId)
                    .then((entities: InsideGroup[]) => {
                        if (!entities) {
                            return new Promise<void>((r) => r());
                        }

                        const haGroup: HaGroupSet = {
                            object_id: g.entityId,
                            name: g.name,
                            entities: entities.map((value: InsideGroup) => value.entityId).join(','),
                        };

                        // if group is already created in HA, the request return [] with status 200
                        return httpService.postGroup(haGroup);
                    }),
            ),
        );
    }

    /**
     * Create a new group
     * @param name Name of the group
     * @param entities Entities belonging to this group
     * @returns The newly created group
     */
    async createGroup(name:string, entities: string[]): Promise<Group> {
        // Normalize the group name
        const groupEntityId = normalizeEntityId(name);

        // Test if group exist, and if not, throw an error
        const g = await databaseForwarder.selectGroupsByEntityId(groupEntityId);
        if (g !== undefined) {
            throw new Error(`Group ${groupEntityId} already exist`);
        }

        // Get list of entity with full detail and check the data
        const entitiesFull = await entityService
            .getEntities()
            .then((ents) => ents.filter((value: Entity) => entities.includes(value.id)));
        await this.checkDataGroupToCreate(entities, entitiesFull);

        // Create group in Home Assistant
        await this.createGroupInHa({
            object_id: groupEntityId,
            name,
            entities: entities.join(','),
        });

        // Insert group into ESIDOM DB
        await this.insertGroupIntoDb(groupEntityId, name, entities);
        const group: Group = {
            groupId: groupEntityId,
            name,
            entities: entitiesFull,
        };

        return group;
    }

    /**
     * Insert the group in our database
     * @param groupId The group id
     * @param name The group name
     * @param entities The entities in the group
     */
    private async insertGroupIntoDb(groupId: string, name: string, entities: string[])
    : Promise<void> {
        await databaseForwarder.insertGroup(groupId, name, entities);
    }

    /**
     * ??
     * @param entities
     * @param entitiesFull
     */
    private async checkDataGroupToCreate(entities: string[], entitiesFull: Entity[])
    : Promise<void> {
        // Test if each entity supply exist in HA

        const entitiesFullOnlyId = entitiesFull.map((v: Entity) => v.id);
        entities.forEach((e) => {
            if (!entitiesFullOnlyId.includes(e)) {
                throw new Error(`Entity ${e} doesn't exist`);
            }
        });
    }

    /**
     * Create a new group in HA
     * @param group The HA group
     */
    private async createGroupInHa(group: HaGroupSet): Promise<unknown> {
        return httpService.postGroup(group);
    }

    /**
     * Get all the groups
     * @returns All the groups
     */
    async getGroups(): Promise<Group[]> {
        return socketService
            .getStates()
            .then((states) => Promise.all(
                states
                    .filter((val) => val.entity_id.startsWith('group'))
                    .map((v) => this.convertEntityToGroup(v)),
            ));
    }

    /**
     * Generate all the implicit groups
     */
    private async generateImplicitGroup(): Promise<void> {
        // Generate implicit group per room
        const rooms = await roomService.getRooms();
        await Promise.all(rooms.map((r) => this.generateImplicitGroupForOneRoom(r)));

        // Generate implicit group for all devices
        const devices: Device[] = await deviceService.getDevices();
        const entities = devices
            .flatMap((d: Device) => d.entities
                .filter((entity: Entity) => entity.id.startsWith('switch') || entity.id.startsWith('light'))
                .map((entity) => entity.id));
        if (!entities || entities.length === 0) {
            return;
        }

        const groupName = 'All switch and light';
        await this.createGroupInHa({
            object_id: this.normalizeImplicitGroupName('switchlight'),
            name: groupName,
            entities: entities.join(','),
        });
    }

    private async generateImplicitGroupForOneRoom(r: Room): Promise<unknown> {
        const entities = r.devices
            .flatMap((x) => x.entities
                .filter((entity) => entity.id.startsWith('switch') || entity.id.startsWith('light')))
            .map((entity) => entity.id);
        // console.log(entities);
        if (!entities || entities.length === 0) {
            return Promise.resolve();
        }
        return this.createGroupInHa({
            object_id: this.normalizeImplicitGroupName('switchlight', r.roomId),
            name: `Light and switch of ${r.name}`,
            entities: entities.join(','),
        });
    }

    /**
     * Normalize the given implicit group name
     * @param type Group type
     * @param roomId Optional group id
     */
    private normalizeImplicitGroupName(type: string, roomId?: string): string {
        if (roomId) {
            return `${GROUP_IMPLICIT_IDENTIFIER}_${roomId}_${type}`;
        }
        return `${GROUP_IMPLICIT_IDENTIFIER}_all_${type}`;
    }

    /**
     * Delete an implicit group for one room
     * @param roomId Id of the group to delete
     */
    private async deleteImplicitGroupForOneRoom(roomId: string): Promise<void> {
        const groups = await this.getGroups();
        const roomGroups = groups.filter((group) => group.groupId.startsWith('imp') && group.groupId.includes(roomId));
        // console.log(roomGroups);
        roomGroups.forEach((g: Group) => {
            this.deleteGroupFromHa(g.groupId);
        });
    }

    /**
     * Delete a group from HA
     * @param groupId Id of the group to delete
     */
    private deleteGroupFromHa(groupId: string): Promise<HaDumbType> {
        return socketService.callService('group', 'remove', { object_id: groupId });
    }

    /**
     * Convert an entity to a group
     * @param e ?
     */
    private async convertEntityToGroup(e: HaStateResponse): Promise<Group> {
        if (!e.attributes.entity_id) {
            throw new Error('Cant convert entity to group');
        }
        const entities: Entity[] = await Promise.all(
            e.attributes.entity_id.map((v: string) => entityService.getEntityById(v)),
        );
        return {
            groupId: e.entity_id.split('.')[1],
            name: e.attributes.friendly_name,
            entities,
        };
    }

}

export default new GroupService();
