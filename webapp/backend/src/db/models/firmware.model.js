
export default (sequelize, DataTypes) => {

    const Firmware = sequelize.define(

        "firmware",
        {
            id: {

                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                unique: true,
                allowNull: false
            },
            name: {

                type: DataTypes.STRING,
                allowNull: false             
            },
            target: {

                type: DataTypes.STRING,
                allowNull: false  
            },
            version: {

                type: DataTypes.INTEGER,
                defaultValue: 1,
                allowNull: false
            },
            hasConfig: {

                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            sizeB: {

                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false
            }
        },
        {
            paranoid: true
        }
    );

    Firmware.prototype.getSanitized = function () {

        const firmware = this.toJSON();

        delete firmware.createdAt;
        delete firmware.updatedAt;
        delete firmware.deletedAt;

        return firmware;
    }

    Firmware.associate = (models) => {

        Firmware.hasMany(models.board);
        Firmware.belongsTo(models.user, { foreignKey: { allowNull: false } });
    }
}