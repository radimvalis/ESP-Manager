
import { Sequelize } from "sequelize";

import UserDefiner from "./models/user.model.js";

export default async function getDb() {

    const sequelize = new Sequelize({

        dialect: "sqlite",
        storage: "db.sqlite"
    });

    const modelDefiners = [ UserDefiner ];

    for (const modelDefiner of modelDefiners) {

        modelDefiner(sequelize);
    }

    await sequelize.sync();

    return sequelize;
}