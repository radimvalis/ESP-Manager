
import AuthService from "./services/auth.service.js";
import CookieService from "./services/cookie.service.js";
import UserService from "./services/user.service.js";

export default class ApplicationContext {

    constructor(config) {

        this.auth = new AuthService(config.auth);
        this.cookie = new CookieService(config.cookie);
        this.user = new UserService(config.models);

        Object.freeze(this);
    }
}