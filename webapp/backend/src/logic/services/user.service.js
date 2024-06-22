
const testDb = [

    {
        id: 12345,
        username: "test",
        password: "test"
    }
];

export default class UserService {

    async create(username, password) {
        
        const newUser = {

            id: Math.floor(Math.random() * ( 99999 - 10000) + 10000),
            username,
            password
        };

        testDb.push(newUser);

        return newUser;
    }

    async getByCredentials(username, password) {

        for (let i = 0; i < testDb.length; i++) {

            const user = testDb[i];

            if (user.username === username && user.password === password) {

                return user;
            }
        }        
    }
}