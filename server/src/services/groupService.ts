import { DBGroup, InsideGroup } from '../types/dbTypes';
import databaseForwarder from '../forwarders/databaseForwarder';
import httpForwarder from '../forwarders/httpForwarder';
import { Group } from '../types/group';
import { HaGroupSet } from '../types/haTypes';
import entityService from './entityService';
import { Entity } from '../types/entity';

const NameGroupTable = 'HAGroup';
const NameInsideGroupTable = 'InsideGroup';

class GroupService {

    async initGroupHa() {
        // Get all group
        const res = await databaseForwarder.db?.all<DBGroup[]>(`SELECT * FROM ${NameGroupTable}`).catch((err) => {
            console.log(err);
        });
        if (res === undefined) {
            return;
        }
        // For each group
        res.forEach(async (g: DBGroup) => {
            const entities = await databaseForwarder.db?.all<InsideGroup[]>(`SELECT * FROM ${NameInsideGroupTable} WHERE groupEntityId = '${g.entityId}'`);
            if (entities === undefined) {
                return;
            }
            const haGroup: HaGroupSet = {
                object_id: g.entityId,
                name: g.name,
                entities: entities.map((value: InsideGroup) => value.entityId).join(','),
            };
            // if group is already created in HA, the request return [] with status 200
            httpForwarder.post('/api/services/group/set', haGroup).catch((err) => { console.log(JSON.stringify(err)); });
        });
    }

    async createGroup(name:string, entities: string[]): Promise<Group> {
        const groupEntityId = this.normalizeEntityId(name);
        // Test if group exist
        const g = await databaseForwarder.db?.get<DBGroup>(`SELECT * FROM ${NameGroupTable} WHERE entityId = '${groupEntityId}'`);
        if (g !== undefined) {
            return Promise.reject(new Error('Group already exist'));
        }

        // Get list of entity with full detail
        const entitiesFull = (await entityService.getEntities())
            .filter((value: Entity) => entities.includes(value.id));

        if (entitiesFull === undefined) {
            return Promise.reject(new Error('All entities not found in HA'));
        }

        // Test if each entity supply exist in HA
        const entitiesFullOnlyId = entitiesFull.map((v: Entity) => v.id);
        // eslint-disable-next-line no-restricted-syntax
        for (let i = 0; i < entities.length; i++) {
            const e = entities[i];
            if (!entitiesFullOnlyId.includes(e)) {
                return Promise.reject(new Error(`Entity ${e} doesn't exist`));
            }
        }
        await httpForwarder.post('/api/services/group/set', {
            object_id: groupEntityId,
            name: `${name}`,
            entities: entities.join(','),
        }).catch((err) => { console.log(JSON.stringify(err)); });

        // Insert group into ESIDOM DB
        try {
            await databaseForwarder.db?.run('BEGIN TRANSACTION');
            await databaseForwarder.db?.run(`INSERT INTO ${NameGroupTable} (entityId, name) VALUES ('${groupEntityId}','${name}')`);
            await Promise.all(
                entities.map(async (entityId: string) => databaseForwarder.db?.run(`INSERT INTO ${NameInsideGroupTable} (entityId, groupEntityId) VALUES ('${entityId}','${groupEntityId}')`)),
            );
            await databaseForwarder.db?.run('COMMIT');
        } catch (err) {
            await databaseForwarder.db?.run('ROLLBACK');
            return Promise.reject(new Error(err));
        }
        const group: Group = {
            groupId: groupEntityId,
            name,
            entities: entitiesFull,
        };
        return group;
    }

    private normalizeEntityId(name: string): string {
        return name.toLowerCase().replace(/ /g, '_');
    }

    async getGroups(): Promise<Group[]> {
        const res = await databaseForwarder.db?.all<DBGroup[]>(`SELECT * FROM ${NameGroupTable}`).catch((err) => {
            console.log(err);
        });
        if (res === undefined) {
            return Promise.reject(new Error('All entities not found in HA'));
        }
        // For each group
        const groups: Group[] = await Promise.all(res.map(async (g: DBGroup) => {
            const insideGroup = await databaseForwarder.db?.all<InsideGroup[]>(`SELECT * FROM ${NameInsideGroupTable} WHERE groupEntityId = '${g.entityId}'`);
            if (insideGroup === undefined) {
                return Promise.reject(new Error('Group with no entity'));
            }
            const entitiesId = insideGroup.map((value: InsideGroup) => value.entityId);
            const entitiesFull = (await entityService.getEntities())
                .filter((value: Entity) => entitiesId.includes(value.id));

            const group: Group = {
                groupId: g.entityId,
                name: g.name,
                entities: entitiesFull,
            };
            return group;

        }));
        return groups;
    }

}

export default new GroupService();
