import { Writable, writable } from 'svelte/store';
import type { User, UserWithoutId } from '../../types/userType';
import http from '../utils/HttpHelper';
import { format, tr } from '../utils/i18nHelper';
import toastService from '../utils/toast';

const { set, subscribe, update } = writable<User | undefined>(JSON.parse(localStorage.getItem('user') ?? 'null') ?? undefined);

const userStore: Writable<User | undefined> = {
    set: (value: User | undefined) => {
        toastService.toast(format(tr('user.connectedAs'), value?.username ?? ''));
        localStorage.setItem('user', JSON.stringify(value));
        set(value);
    },
    subscribe,
    update,
};

export default class UserService {
    static user = userStore;

    static currentUser: User | undefined;

    /**
     * Locks the application.
     * @param password the new password used to lock the application
     */
    static async lockFront(password: string): Promise<string> {
        return http.post('/user/lock', { password });
    }

    /**
     * Checks if the application is locked.
     */
    static async isLocked(): Promise<boolean> {
        return http.get('/user/isLocked');
    }

    /**
     * Unlocks the application.
     * @param password the password used to unlock the application
     */
    static async unlockFront(password: string): Promise<boolean> {
        return http.post('/user/unlock', { password });
    }

    /**
     * Gets the users.
     */
    static async getUsers(): Promise<User[]> {
        return http.get<User[]>('/user')
            .then((users: User[]) => users
                .sort((a: User, b: User) => (
                    a.username.toLowerCase() > b.username.toLowerCase() ? 1 : -1)));
    }

    /**
     * Gets a user by its id.
     * @param id the user id
     */
    static async getUserById(id: string): Promise<User> {
        return http.get(`/user/${id}`);
    }

    /**
     * Creates a user.
     * @param username the user name
     * @param admin is the user an admin?
     * @param entities the entities linked to the user
     */
    static async createUser(username: string, admin: boolean, entities?: string[]): Promise<User> {
        const body: UserWithoutId = { username, admin };
        if (entities) {
            body.entities = entities;
        }
        return http.post('/user', body);
    }

    /**
     * Updates a user.
     * @param id the user id
     * @param username the user name
     * @param admin is the user an admin?
     * @param entities the entities linked to the user
     */
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

    /**
     * Deletes a user.
     * @param id the user id
     */
    static async deleteUser(id: string): Promise<{message: string} | {error: string}> {
        return http.delete(`/user/${id}`);
    }
}

UserService.user.subscribe((newUser) => {
    UserService.currentUser = newUser;
});
