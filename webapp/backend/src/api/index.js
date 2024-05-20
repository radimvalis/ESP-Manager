
import express from "express";
import cors from "cors";

import { URL } from "shared";

import UserController from "./controllers/user.controller.js";

export default function start(context, port) {

    const userController = new UserController(context);

    const app = express();

    app.use(cors());
    app.use(express.json());

    app.post(URL.USER.CREATE, userController.create);
    app.post(URL.USER.LOG_IN, userController.logIn);

    app.listen(port, () => {

        console.log(`Backend app listening on port ${port}`);
    });
}