export default class Entity {
    static async getEntities(type: string = '') {
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');

        if (!type) {
            const response = await fetch('http://localhost:3000/entity', {
                headers,
                method: 'GET',
            }).then((x) => x);

            return response.json();
        }
        const response = await fetch(`http://localhost:3000/entity?type=${type}`, {
            headers,
            method: 'GET',
        }).then((x) => x);

        return response.json();
    }
}

// export default new Entity();
// export function hello
