
import AuthService from "./services/auth.service.js";
import CookieService from "./services/cookie.service.js";
import UserService from "./services/user.service.js";
import FileService from "./services/file.service.js";
import BoardService from "./services/board.service.js";
import FirmwareService from "./services/firmware.service.js";

export default class ApplicationContext {

    constructor(config) {

        this.auth = new AuthService(config.auth);
        this.cookie = new CookieService(config.cookie);
        this.user = new UserService(config.models);
        this.file = new FileService(config);
        this.board = new BoardService(config);
        this.firmware = new FirmwareService(config.models);

        Object.freeze(this);
    }

    async init() {

        await this.file.init();
        await this.board.init();
    }
}