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

    static async lockFront(password: string): Promise<string> {
        return http.post<string, {password:string}>('/user/lock', { password })
            .then((b) => b)
            .catch(() => {
                toastService.toast(tr('user.errorWhileLocking'), 'error');
                return '';
            });
    }

    static async isLocked(): Promise<boolean> {
        return http.get<boolean>('/user/isLocked')
            .then((b) => b)
            .catch(() => {
                toastService.toast(tr('user.errorWhileLocking'), 'error');
                return false;
            });
    }

    static async unlockFront(password: string): Promise<boolean> {
        return http.post<boolean, {password:string}>('/user/unlock', { password })
            .then((b) => b)
            .catch(() => {
                toastService.toast(tr('user.errorWhileUnlocking'), 'error');
                return false;
            });
    }

    static async getUsers(): Promise<User[]> {
        return http.get<User[]>('/user')
            .then((users: User[]) => users
                .sort((a: User, b: User) => (
                    a.username.toLowerCase() > b.username.toLowerCase() ? 1 : -1)))
            .catch(() => {
                toastService.toast(tr('user.errorWhileLoading'), 'error');
                return [];
            });
    }

    static async getUserById(id: string): Promise<User> {
        return http.get<User>(`/user/${id}`)
            .then((u) => u)
            .catch(() => {
                toastService.toast(tr('user.errorWhileLoadingUser'), 'error');
                return {} as User;
            });
    }

    static async createUser(username: string, admin: boolean, entities?: string[]): Promise<User> {
        const body: UserWithoutId = { username, admin };
        if (entities) {
            body.entities = entities;
        }
        return http.post<User, UserWithoutId>('/user', body)
            .then((u) => u)
            .catch(() => {
                toastService.toast(tr('user.errorWhileCreating'), 'error');
                return {} as User;
            });
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
        return http.put<User, {
            username?: string;
            admin?: boolean;
            entities?: string[];
        }>(`/user/${id}`, body)
            .then((u) => u)
            .catch(() => {
                toastService.toast(tr('user.errorWhileUpdating'), 'error');
                return {} as User;
            });
    }

    static async deleteUser(id: string): Promise<{message: string} | {error: string}> {
        return http.delete<{message: string} | {error: string}, undefined>(`/user/${id}`)
            .then((res) => res)
            .catch(() => {
                toastService.toast(tr('user.errorWhileDeleting'));
                return { error: tr('user.errorWhileDeleting') };
            });
    }
}

UserService.user.subscribe((newUser) => {
    UserService.currentUser = newUser;
});
