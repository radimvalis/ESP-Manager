
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
            binPath: {

                type: DataTypes.STRING,
                allowNull: false 
            },
            configPath: {

                type: DataTypes.STRING,
                allowNull: false 
            },
            version: {

                type: DataTypes.INTEGER,
                defaultValue: 1,
                allowNull: false
            }
        }
    );

    Firmware.associate = (models) => {

        Firmware.hasMany(models.board);
        Firmware.belongsTo(models.user, { foreignKey: { allowNull: false } });
    }
}