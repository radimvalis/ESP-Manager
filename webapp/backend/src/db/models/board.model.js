
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
            firmwareVersion: {

                type: DataTypes.INTEGER
            }
        }
    );

    Board.associate = (models) => {

        Board.belongsTo(models.firmware);
        Board.belongsTo(models.user, { foreignKey: { allowNull: false } });
    }
}