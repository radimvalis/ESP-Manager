
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { endpoint } from "shared";

import multer, { diskStorage } from "multer";
import authSessionMiddleware from "./middlewares/auth.session.middleware.js";
import authRefreshMiddleware from "./middlewares/auth.refresh.middleware.js";
import authBoardMiddleware from "./middlewares/auth.board.middleware.js";

import AuthController from "./controllers/auth.controller.js";
import UserController from "./controllers/user.controller.js";
import FileController from "./controllers/file.controller.js";
import BoardController from "./controllers/board.controller.js";
import FirmwareController from "./controllers/firmware.controller.js";

export default function start(context, port) {

    const authController = new AuthController(context);
    const userController = new UserController(context);
    const fileController = new FileController(context);
    const boardController = new BoardController(context);
    const firmwareController = new FirmwareController(context);

    const app = express();

    app.use(cors());
    app.use(cookieParser());
    app.use(express.json());

    const upload = multer({ storage: diskStorage({}) });

    // =====================
    // Unprotected endpoints
    // =====================

    // Auth

    app.post(endpoint.auth.logIn(), authController.logIn);
    app.post(endpoint.auth.signUp(), authController.signUp);
    app.post(endpoint.auth.refreshTokens(), authRefreshMiddleware(context), authController.refreshTokens);

    // ============================
    // Password-protected endpoints
    // ============================

    // File

    app.get(endpoint.files.firmware(),authBoardMiddleware(context), fileController.getFirmware);
    app.get(endpoint.files.nvs(), authBoardMiddleware(context), fileController.getNVS);

    // =========================
    // Token-protected endpoints
    // =========================

    app.use(authSessionMiddleware(context));

    // Auth

    app.post(endpoint.auth.logOut(), authController.logOut);

    // User

    app.get(endpoint.users.me(), userController.get);

    // File

    app.get(endpoint.files.default.firmware(), fileController.getDefaultFirmware);
    app.get(endpoint.files.default.configForm(), fileController.getDefaultConfigForm);
    app.get(endpoint.files.default.bootloader(), fileController.getDefaultBootloader);
    app.get(endpoint.files.default.partitionTable(), fileController.getDefaultPartitionTable);
    app.get(endpoint.files.default.NVS(), fileController.getDefaultNVS);
    app.get(endpoint.files.configForm(), fileController.getConfigForm);

    // Board

    app.get(endpoint.boards.supportedChips(), boardController.getSupportedChips);
    app.post(endpoint.boards.all(), boardController.create);
    app.get(endpoint.boards.watchAll(), boardController.watchAll);
    app.get(endpoint.boards.watchOne(), boardController.watchOne);
    app.get(endpoint.boards.all(), boardController.getAll);
    app.get(endpoint.boards.one(), boardController.getOne);
    app.put(endpoint.boards.one(), upload.any(), boardController.update);
    app.delete(endpoint.boards.one(), boardController.delete);

    // Firmware

    app.post(endpoint.firmwares.all(), upload.array("files"), firmwareController.create);
    app.get(endpoint.firmwares.all(), firmwareController.getAll);
    app.get(endpoint.firmwares.one(), firmwareController.getOne);
    app.post(endpoint.firmwares.one(), upload.single("file"), firmwareController.update);
    app.delete(endpoint.firmwares.one(), firmwareController.delete);

    //

    app.listen(port, () => {

        console.log(`Backend app listening on port ${port}`);
    });
}