
import { Sequelize, DataTypes } from "sequelize";

import defineUser from "./models/user.model.js";
import defineBoard from "./models/board.model.js";
import defineFirmware from "./models/firmware.model.js";

export default async function getDb() {

    const sequelize = new Sequelize({

        dialect: "sqlite",
        storage: "db.sqlite"
    });

    [ defineUser, defineBoard, defineFirmware ].forEach((definer) => definer(sequelize, DataTypes));

    Object.values(sequelize.models).forEach((model) => model.associate(sequelize.models));

    await sequelize.sync();

    return sequelize;
}