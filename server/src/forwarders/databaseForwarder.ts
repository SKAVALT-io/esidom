import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
import { DBGroup, InsideGroup } from '../types/dbTypes';

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
                entities.map(async (entityId: string) => this.db
                    .run(`INSERT INTO ${InsideGroupTableName} (entityId, groupEntityId) VALUES ('${entityId}','${groupId}')`)),
            );
            await this.db.run('COMMIT');
        } catch (err) {
            await this.db.run('ROLLBACK');
            throw err;
        }
    }

}

export default new DatabaseForwarder();
