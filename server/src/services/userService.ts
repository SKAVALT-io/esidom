import { User } from '../types/user';

class UserService {

    async getUsers(): Promise<User[]> {
        return new Promise(() => {});
    }

}

export default new UserService();
