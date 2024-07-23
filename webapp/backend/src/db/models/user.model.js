
export default (sequelize, DataTypes) => {

    const User = sequelize.define(

        "user",
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
                allowNull: false
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

    User.associate = (models) => {

        User.hasMany(models.board);
        User.hasMany(models.firmware);
    }
}