
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
            version: {

                type: DataTypes.INTEGER,
                defaultValue: 1,
                allowNull: false
            },
            hasConfig: {

                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false
            }
        }
    );

    Firmware.prototype.getSanitized = function () {

        const board = this.toJSON();

        delete board.boardId;

        return board;
    }

    Firmware.associate = (models) => {

        Firmware.hasMany(models.board);
        Firmware.belongsTo(models.user, { foreignKey: { allowNull: false } });
    }
}