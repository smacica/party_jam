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

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        role: {
            type: DataTypes.ENUM("user", "admin", "superadmin"),
            defaultValue: "user",
        },
    },
    {
        tableName: "users",
        timestamps: true, // Adds createdAt and updatedAt fields
        paranoid: true, // Adds deletedAt field for soft deletes
    }
);

const Playlist = sequelize.define(
    "Playlist",
    {
        collaborative: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        followers_href: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        followers_total: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        href: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: true,
        },
        images: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        owner_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        public: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        snapshot_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        uri: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "playlists",
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

const JamPlaylist = sequelize.define(
    "JamPlaylist",
    {
        collaborative: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        followers_href: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        followers_total: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        href: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: true,
        },
        images: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        owner_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        public: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        snapshot_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        uri: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: "jam_playlists",
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

const JamTrack = sequelize.define(
    "JamTrack",
    {
        original: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        uri: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "jam_tracks",
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

User.hasMany(Playlist, { foreignKey: "user_id" });
User.hasMany(JamPlaylist, { foreignKey: "user_id" });
JamPlaylist.hasMany(JamTrack, { foreignKey: "jam_playlist_id" });

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

module.exports = { initializeDb, Token, User, Playlist, JamPlaylist, JamTrack };
