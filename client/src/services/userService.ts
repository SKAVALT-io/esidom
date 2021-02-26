import type { User, UserWithoutId } from '../../types/userType';
import http from '../utils/HttpHelper';

export default class UserService {
    static async lockFront(password: string): Promise<string> {
        return http.post('/user/lock', { password });
    }

    static async isLocked(): Promise<boolean> {
        return http.get('/user/isLocked');
    }

    static async unlockFront(password: string): Promise<boolean> {
        return http.post('/user/unlock', { password });
    }

    static async getUsers(): Promise<User[]> {
        return http.get('/user');
    }

    static async getUserById(id: string): Promise<User> {
        return http.get(`/user/${id}`);
    }

    static async createUser(username: string, admin: boolean, entities?: string[]): Promise<User> {
        const body: UserWithoutId = { username, admin };
        if (entities) {
            body.entities = entities;
        }
        return http.post('/user', body);
    }

    static async updateUser(id: string, username?: string,
        admin?: boolean, entities?: string[]): Promise<User> {
        const body: {
            username?: string;
            admin?: boolean;
            entities?: string[];
        } = {};
        if (username) {
            body.username = username;
        }
        if (admin) {
            body.admin = admin;
        }
        if (entities) {
            body.entities = entities;
        }
        return http.put(`/user/${id}`, body);
    }
}
