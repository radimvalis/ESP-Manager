
import AuthService from "./services/auth.service.js";
import CookieService from "./services/cookie.service.js";
import UserService from "./services/user.service.js";
import FileService from "./services/file.service.js";
import BoardService from "./services/board.service.js";
import FirmwareService from "./services/firmware.service.js";

export default class ApplicationContext {

    constructor(config) {

        this.auth = new AuthService(config);
        this.cookie = new CookieService(config);
        this.user = new UserService(config);
        this.file = new FileService(config);
        this.firmware = new FirmwareService(config, this.file);
        this.board = new BoardService(config, this.file, this.firmware);

        Object.freeze(this);
    }

    async init() {

        await this.file.init();
        await this.board.init();
    }
}