import { User } from '../types';

class UserService {

    /**
     * Get all the users
     */
    async getUsers(): Promise<User[]> {
        return new Promise(() => {});
    }

}

export default new UserService();
