import { databaseForwarder } from '../forwarders';
import { User } from '../types';

class UserService {

    private frontPassword: string | undefined = undefined;

    /**
     * Get all the users
     */
    async getUsers(): Promise<User[]> {
        return databaseForwarder
            .getUsers();
    }

    async createUser(username: string, admin: boolean, entities?: string[]): Promise<User> {
        return databaseForwarder
            .createUser(username, admin, entities);
    }

    async getUserById(id: number): Promise<User> {
        return databaseForwarder
            .getUserById(id);
    }

    async updateUser(id: number, username?: string,
        admin?: boolean, entities?: string[]): Promise<User> {
        return databaseForwarder
            .updateUser(id, username, admin, entities);
    }

    async deleteUser(id: number): Promise<void> {
        return databaseForwarder
            .deleteUser(id);
    }

    async lockFront(password: string): Promise<string> {
        if (this.frontPassword) {
            throw new Error('Un mot de passe est déjà définit.');
        }

        this.frontPassword = password;
        return password;
    }

    async unlockFront(password: string): Promise<boolean> {
        console.log(password, this.frontPassword);
        if (password === this.frontPassword) {
            this.frontPassword = undefined;
            return true;
        }
        return false;
    }

    async isLocked(): Promise<boolean> {
        return this.frontPassword !== undefined;
    }

}

export default new UserService();
