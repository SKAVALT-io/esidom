import { DBGroup, InsideGroup } from '../types/dbTypes';
import databaseForwarder from '../forwarders/databaseForwarder';
import httpForwarder from '../forwarders/httpForwarder';
import { Group } from '../types/group';
import { HaDumbType, HaGroupSet, HaStateResponse } from '../types/haTypes';
import entityService from './entityService';
import roomService from './roomService';
import { Entity } from '../types/entity';
import socketForwarder from '../forwarders/socketForwarder';
import { EventObserver } from '../types/observer';
import deviceService from './deviceService';
import { Room } from '../types/room';
import { Device } from '../types/device';
import socketService from './socketService';

const GroupImplicitIdentifier = 'imp';

class GroupService implements EventObserver {

    constructor() {
        socketForwarder.registerObserver(this);
    }

    onAuthOk() {
        this.initGroupHa();
    }

    onDeviceRegistryUpdated(data: string) {
        // To avoid search recreate all implicit group
        this.generateImplicitGroup();
    }

    async onAreaUpdated(roomId: string) {
        console.log('GPService : this.onAreaUpdated');
        const room: Room | undefined = await roomService.getRoomById(roomId);
        if (!room) {
            return;
        }
        this.generateImplicitGroupForOneRoom(room);
    }

    onAreaRemoved(roomId: string) {
        console.log('GPService : this.onAreaRemoved');
        this.deleteImplicitGroupForOneRoom(roomId);
    }

    private async initGroupHa() {
        await this.loadGroupFromDb();
        await this.generateImplicitGroup();
    }

    private async loadGroupFromDb(): Promise<void> {
        // Get all group
        const res = await databaseForwarder.selectAllGroups()
            .catch((err: any) => {
                console.log(err);
                throw new Error('Unexpected database error');
            });
        await Promise.all(
            res.map((g: DBGroup) => databaseForwarder.selectInsideGroupsByEntityId(g.entityId)
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
                    return httpForwarder.post('/api/services/group/set', haGroup);
                })),
        );
    }

    async createGroup(name:string, entities: string[]): Promise<Group> {
        const groupEntityId = this.normalizeEntityId(name);
        // Test if group exist
        const g = await databaseForwarder.selectGroupsByEntityId(groupEntityId);
        if (g !== undefined) {
            throw new Error('Group already exist');
        }
        // Get list of entity with full detail
        const entitiesFull = (await entityService.getEntities())
            .filter((value: Entity) => entities.includes(value.id));

        this.checkDataGroupToCreate(entities, entitiesFull);
        // Create group in Home Assistant
        await this.createGroupInHa({
            object_id: groupEntityId,
            name,
            entities: entities.join(','),
        });
        // Insert group into ESIDOM DB
        this.insertGroupIntoDb(groupEntityId, name, entities);
        const group: Group = {
            groupId: groupEntityId,
            name,
            entities: entitiesFull,
        };
        return group;
    }

    private async insertGroupIntoDb(groupId: string, name: string, entities: string[])
    :Promise<void> {
        await databaseForwarder.insertGroup(groupId, name, entities);
    }

    private checkDataGroupToCreate(entities: string[], entitiesFull: Entity[]) {
        if (!entitiesFull) {
            throw new Error('All entities not found in HA');
        }

        // Test if each entity supply exist in HA
        const entitiesFullOnlyId = entitiesFull.map((v: Entity) => v.id);
        // eslint-disable-next-line no-restricted-syntax
        for (let i = 0; i < entities.length; i++) {
            const e = entities[i];
            if (!entitiesFullOnlyId.includes(e)) {
                throw new Error(`Entity ${e} doesn't exist`);
            }
        }
    }

    private async createGroupInHa(group: HaGroupSet) {
        return httpForwarder.post('/api/services/group/set', group);
    }

    private normalizeEntityId(name: string): string {
        return name.toLowerCase().replace(/ /g, '_');
    }

    async getGroups(): Promise<Group[]> {
        const res: HaStateResponse[] = await socketService.getStates();
        return Promise.all(
            res
                .filter((val) => val.entity_id.startsWith('group'))
                .map((v) => this.convertEntityToGroup(v)),
        );
    }

    private async generateImplicitGroup():Promise<void> {
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
        const nameGroup = 'All switch and light';
        this.createGroupInHa({
            object_id: this.normalizeImplicitGroupName('switchlight'),
            name: nameGroup,
            entities: entities.join(','),
        });

    }

    private async generateImplicitGroupForOneRoom(r: Room) {
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

    private normalizeImplicitGroupName(type: string, roomId?: string): string {
        if (roomId) {
            return `${GroupImplicitIdentifier}_${roomId}_${type}`;
        }
        return `${GroupImplicitIdentifier}_all_${type}`;
    }

    private async deleteImplicitGroupForOneRoom(roomId: string) {
        const groups = await this.getGroups();
        const roomGroups = groups.filter((group) => group.groupId.startsWith('imp') && group.groupId.includes(roomId));
        console.log(roomGroups);
        roomGroups.forEach((g: Group) => {
            this.deleteGroupFromHa(g.groupId);
        });
    }

    private deleteGroupFromHa(groupId: string): Promise<HaDumbType> {
        return socketService.callService('group', 'remove', { object_id: groupId });
    }

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
