
import UserService from "./services/user.service.js";

export default class ApplicationContext {

    services;

    constructor() {

        this.services = {

            user: new UserService()
        }

        Object.freeze(this);
    }
}