
export default (sequelize, DataTypes) => {

    const Board = sequelize.define(

        "board",
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
            httpPassword: {

                type: DataTypes.STRING,
                allowNull: false
            },
            mqttPassword: {

                type: DataTypes.STRING,
                allowNull: false
            },
            isOnline: {
                
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            isBeingUpdated: {

                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            chipName: {

                type: DataTypes.STRING,
                allowNull: false
            },
            flashSizeMB: {

                type: DataTypes.INTEGER,
                allowNull: false
            },
            firmwareVersion: {

                type: DataTypes.INTEGER
            },
            firmwareStatus: {

                type: DataTypes.VIRTUAL,

                get() {

                    if (this.firmwareVersion === undefined || this.firmware === undefined) {

                        return null;
                    }

                    if (this.firmware === null) {

                        return "default";
                    }

                    if (!this.firmware.version) {

                        return null;
                    }
                    
                    if (this.firmwareVersion === this.firmware.version) {

                        return "latest";
                    }

                    return "update available";  
                }
            }
        }
    );

    Board.prototype.getSanitized = function () {

        const board = this.toJSON();

        delete board.httpPassword;
        delete board.mqttPassword;
        delete board.createdAt;
        delete board.updatedAt;

        if (!board.firmwareStatus) {

            delete board.firmwareStatus;
        }

        return board;
    };

    Board.associate = (models) => {

        Board.belongsTo(models.firmware);
        Board.belongsTo(models.user, { foreignKey: { allowNull: false } });
    }
}