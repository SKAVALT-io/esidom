import http from '../utils/HttpHelper';

// eslint-disable-next-line import/prefer-default-export
export async function launchPair(): Promise<void> {
    return http.post('/device');
}
