
import { DataTypes } from "sequelize";

export default (sequelize) => {

    sequelize.define(

        "User",
        {
            id: {

                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                unique: true,
                allowNull: false
            },
            username: {

                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            password: {

                type: DataTypes.STRING,
                allowNull: false                
            }
        }
    );
}