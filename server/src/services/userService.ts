import { User } from '../types';

class UserService {

    private frontPassword: string | undefined = undefined;

    /**
     * Get all the users
     */
    async getUsers(): Promise<User[]> {
        return new Promise(() => {});
    }

    async lockFront(password: string): Promise<string> {
        if (this.frontPassword) {
            throw new Error('Un mot de pass est déjà définit.');
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
