import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
import { logger } from '../utils';
import { DBGroup, Group, InsideGroup } from '../types';

const GroupTableName = 'HAGroup';
const InsideGroupTableName = 'InsideGroup';

class DatabaseForwarder {

    private db!: Database<sqlite3.Database, sqlite3.Statement>;

    constructor() {
        sqlite3.verbose();
    }

    setDb(db: Database<sqlite3.Database, sqlite3.Statement>) {
        this.db = db;
    }

    async selectAllGroups(): Promise<DBGroup[]> {
        return this.db?.all<DBGroup[]>(`SELECT * FROM ${GroupTableName}`);
    }

    async selectInsideGroupsByEntityId(entityId: string): Promise<InsideGroup[]> {
        return this.db
            .all<InsideGroup[]>(`SELECT * FROM ${InsideGroupTableName} WHERE groupEntityId = '${entityId}'`);
    }

    async selectGroupsByEntityId(entityId: string): Promise<DBGroup | undefined> {
        return this.db.get<DBGroup>(`SELECT * FROM ${GroupTableName} WHERE entityId = '${entityId}'`);
    }

    async insertGroup(groupId: string, name: string, entities: string[]): Promise<void> {
        try {
            await this.db.run('BEGIN TRANSACTION');
            await this.db.run(`INSERT INTO ${GroupTableName} (entityId, name) VALUES ('${groupId}','${name}')`);
            await Promise.all(
                entities.map(async (entityId) => this.db
                    .run(`INSERT INTO ${InsideGroupTableName} (entityId, groupEntityId) VALUES ('${entityId}','${groupId}')`)),
            );
            await this.db.run('COMMIT');
        } catch (err) {
            await this.db.run('ROLLBACK');
            logger.error(`Unexpected error while inserting group into database : ${err}`);
            throw err;
        }
    }

    async deleteGroup(groupId: string): Promise<void> {
        try {
            await this.db.run('BEGIN TRANSACTION');
            await this.db.run(`DELETE FROM ${InsideGroupTableName} WHERE groupEntityId = '${groupId}'`);
            await this.db.run(`DELETE FROM ${GroupTableName} WHERE entityId = '${groupId}'`);
            await this.db.run('COMMIT');
        } catch (err) {
            await this.db.run('ROLLBACK');
            throw err;
        }
    }

    async updateGroup(oldGroup: Group, group: Group,
        entitiesChanged: boolean, nameChanged: boolean): Promise<void> {
        const oldEntitiesString = oldGroup.entities.map((e) => e.id);
        const newEntitiesString = group.entities.map((e) => e.id);
        if (!entitiesChanged) {
            const requests = oldEntitiesString
                .filter((entityId) => !newEntitiesString.includes(entityId))
                .map((entityId) => `DELETE FROM ${InsideGroupTableName} WHERE entityId = '${entityId}'`);

            requests.push(...newEntitiesString
                .filter((entityId) => !oldEntitiesString.includes(entityId))
                .map((entityId) => `INSERT INTO ${InsideGroupTableName} (entityId, groupEntityId) VALUES ('${entityId}','${group.groupId}')`));
            try {
                await this.db.run('BEGIN TRANSACTION');
                await Promise.all(requests.map((request) => this.db.run(request)));
                await this.db.run('COMMIT');
            } catch (err) {
                await this.db.run('ROLLBACK');
                throw err;
            }
        }
        if (!nameChanged) {
            await this.db.run(`UPDATE ${GroupTableName} SET name = '${group.name}' WHERE entityId = '${group.groupId}'`);
        }
    }

}

export default new DatabaseForwarder();
