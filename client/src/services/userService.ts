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
}
