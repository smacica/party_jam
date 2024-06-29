require("dotenv").config();
const axios = require("axios");
const cors = require("cors");
require("module-alias/register");

const { refreshAccessToken } = require("./spotify/Auth/spotifyOAuth");
const { access_token, refresh_token } = require("@/spotify/Auth/tokenCache");
const { initializeDb, Token } = require("@/db/init");
const cookieParser = require("cookie-parser");

//routes
const appAuth = require("@/routes/appAuth");
const playlist = require("@/routes/playlist");
const track = require("@/routes/track");
const userAuth = require("@/routes/Auth");
const player = require("@/routes/player");
const errorHandler = require("@/middleware/errorHandler");
const jamPlaylist = require("@/routes/jamPlaylist");

//express stuff
const express = require("express");

const port = process.env.APP_PORT;
const app = express();

//env imports

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());
app.use("/", appAuth);
app.use("/playlist", playlist);
app.use("/track", track);
app.use("/", userAuth);
app.use("/jam", jamPlaylist);
app.use("/", player);

app.get("/", (req, res) => {
    const appleValue = req.query.apple;
    res.send(`Welcome to Party jam! 🎊 apple: ${appleValue}`);
});

app.use(errorHandler);

app.listen(port, "0.0.0.0", async () => {
    console.log(`Example app listening on port ${port}`);
    await initializeDb();
    const db_refresh_token = await Token.findByPk("refresh_token");

    if (db_refresh_token) {
        try {
            refresh_token.update(db_refresh_token.value);
            const response = await refreshAccessToken(refresh_token.value);
            access_token.update(response.access_token);

            setInterval(async () => {
                const response = await refreshAccessToken(refresh_token.value);
                access_token.update(response.access_token);
                console.log("refreshed token");
            }, 3000000);
        } catch (err) {
            console.log(err.message);
        }
    }
});
