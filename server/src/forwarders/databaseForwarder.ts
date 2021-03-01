import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
import { logger } from '../utils';
import {
    DBGroup, Group, InsideGroup, User,
} from '../types';

const GroupTableName = 'HAGroup';
const InsideGroupTableName = 'InsideGroup';
type SqlUser = {id: number, username: string, admin:Number};
type UserEntities = { entityId: string};

class DatabaseForwarder {

    private db!: Database<sqlite3.Database, sqlite3.Statement>;

    constructor() {
        sqlite3.verbose();
    }

    setDb(db: Database<sqlite3.Database, sqlite3.Statement>) {
        this.db = db;
    }

    async selectAllGroups(): Promise<DBGroup[]> {
        return this.db.all<DBGroup[]>(`SELECT * FROM ${GroupTableName}`);
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

    async getUsers(): Promise<User[]> {
        const sqlUsers = await this.db
            .all<SqlUser[]>('SELECT * FROM User');

        return this.getUsersWithEntities(sqlUsers);
    }

    async createUser(username: string, admin: boolean, entities?: string[]): Promise<User> {
        try {
            await this.db.run('BEGIN TRANSACTION');
            const res = await this.db.run(`INSERT INTO User (username, admin) VALUES ('${username}', ${admin ? 1 : 0})`);
            if (!res.lastID) {
                throw new Error('Unable to insert user into database');
            }
            const id = res.lastID;
            if (entities) {
                this.insertUserEntities(id, entities);
            }
            await this.db.run('COMMIT');
            return this.getUserById(res.lastID);
        } catch (err) {
            await this.db.run('ROLLBACK');
            logger.error(`Unexpected error while inserting user into database : ${err}`);
            throw err;
        }
    }

    async getUserById(id: number): Promise<User> {
        const sqlUsers = await this.db.all<SqlUser[]>(`SELECT * FROM User WHERE id == ${id}`);
        const users = await this.getUsersWithEntities(sqlUsers);
        if (users.length === 0) {
            throw new Error(`No user with such id ${id}`);
        }
        if (users.length > 1) {
            throw new Error('Database is inconsistent (at least two users have the same id)');
        }
        return users[0];
    }

    // TODO: fix this method
    async updateUser(id: number, username?: string,
        admin?: boolean, entities?: string[]): Promise<User> {
        if (username) {
            await this.updateUserField(id, `username = '${username}'`);
        }
        if (admin) {
            await this.updateUserField(id, `admin = ${admin ? 1 : 0}`);
        }
        if (entities) {
            await this.insertUserEntities(id, entities);
        }
        return this.getUserById(id);
    }

    private async updateUserField(userId: number, keyValue: string): Promise<void> {
        logger.debug(`UPDATE User as u SET ${keyValue} WHERE u.id = ${userId}`);
        await this.db.run(`UPDATE User as u SET ${keyValue} WHERE u.id = ${userId}`);
    }

    private async getUsersWithEntities(users: SqlUser[]): Promise<User[]> {
        return Promise.all(
            users.map(async (u): Promise<User> => {
                const userEntities = await this.db.all<UserEntities[]>(`SELECT entityId FROM AccessEntity as a WHERE a.userId == ${u.id}`);
                return {
                    id: `${u.id}`,
                    username: u.username,
                    admin: u.admin === 1,
                    entities: userEntities.map((ue) => ue.entityId),
                };
            }),
        );
    }

    private async insertUserEntities(userId: number, entities: string[]): Promise<void> {
        try {
            await this.db.run('BEGIN TRANSACTION');
            await this.db.run(`DELETE FROM AccessEntity as a WHERE a.userId = ${userId}`);
            await Promise.all(
                entities.map(async (entityId) => this.db
                    .run(`INSERT INTO AccessEntity(userId, entityId) VALUES(${userId}, '${entityId}')`)),
            );
            await this.db.run('COMMIT');
            return;
        } catch (err) {
            await this.db.run('ROLLBACK');
            logger.error(`Unexpected error while deleting user from database : ${err}`);
            throw err;
        }
    }

    async deleteUser(userId: number): Promise<void> {
        try {
            await this.db.run('BEGIN TRANSACTION');
            // const sql = 'DELETE FROM User as u WHERE u.id = ($userId)';
            // const st = await this.db.prepare(sql);
            // st.run(userId, (err: any) => {
            //     if (err) {
            //         logger.error(err.message);
            //         throw new Error(err.message);
            //     }
            // });
            let res = await this.db.run(`DELETE FROM User as u WHERE u.id = ${userId}`, (err: any) => {
                if (err) {
                    logger.error(err.message);
                    throw new Error(err.message);
                }
            });
            if (res?.changes === 0) {
                throw new Error('No user with such id');
            }
            await this.db.run(`DELETE FROM AccessEntity as a WHERE a.userId = ${userId}`);
            await this.db.run('COMMIT');
            return;
        } catch (err) {
            await this.db.run('ROLLBACK');
            logger.error(`Unexpected error while deleting user from database : ${err}`);
            throw err;
        }
    }

}

export default new DatabaseForwarder();
