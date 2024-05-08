const { Sequelize, DataTypes, Model } = require("sequelize");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./main.sqlite",
});

const Token = sequelize.define(
    "Token",
    {
        type: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        value: {
            type: DataTypes.STRING,
        },
    },
    {
        tableName: "tokens",
        timestamps: false,
    }
);

const initializeDb = async () => {
    try {
        await sequelize.authenticate();

        await sequelize.sync();

        console.log("Connection has been established successfully.🟩");
    } catch (error) {
        throw error;
    }
};
/*
        const [item, i] = await Token.upsert({
            type: "type_test",
            value: "upsert successfull 2",
        });
*/

module.exports = { initializeDb, Token };
