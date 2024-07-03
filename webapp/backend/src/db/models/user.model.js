
import { DataTypes } from "sequelize";

export default (sequelize) => {

    const User = sequelize.define(

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

    User.prototype.getSanitized = function () {

        const user = this.toJSON();

        delete user.password;
        delete user.createdAt;
        delete user.updatedAt;

        return user;
    };
}