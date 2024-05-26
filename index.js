require("dotenv").config();
const axios = require("axios");
const cors = require("cors");
require("module-alias/register");
const {
    getTracks,
    getArtistData,
    getProfile,
} = require("./spotify/spotify_utils/getFunctions");

const playlist = require("./spotify/spotify_utils/playlist");
const { generateRandomString } = require("./helper_functions/helpers");
const {
    getAccessToken,
    refreshAccessToken,
    getUserAccessToken,
} = require("./spotify/Auth/spotifyOAuth");
const { access_token, refresh_token } = require("@/spotify/Auth/tokenCache");

const { initializeDb, Token } = require("@/db/init");

//routes
const appAuth = require("@/routes/appAuth");

//express stuff
const express = require("express");
const { error } = require("console");

const port = process.env.APP_PORT;
const app = express();

//env imports
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

app.use(cors());
app.use(express.json());

app.use("/", appAuth);

app.get("/", (req, res) => {
    const appleValue = req.query.apple;
    res.send(`Welcome to Party jam! 🎊 apple: ${appleValue}`);
});

app.get("/profile", async (req, res) => {
    try {
        const response = await getProfile(access_token.value);

        res.json({ payload: response });
    } catch (err) {
        console.log(err);
        res.send({ error: "fetching profile falied" });
    }
});

app.get("/search", async (req, res) => {
    try {
        const query = req.query.q;

        const response = await getTracks(access_token.value, query);

        res.json({ payload: response });
    } catch (err) {
        console.log(err);
        res.send({ error: "fetching tracks falied" });
    }
});

app.post("/track/add", async (req, res) => {
    try {
        console.log("track uri: ", req.body.uri);
        const response = await playlist.add(
            access_token.value,
            req.body.uri,
            process.env.TESTING_PLAYLIST_ID
        );
        res.send({ message: "successfully added track" });
    } catch (err) {
        console.log(err);
        res.send({ message: "failed fetching adding track" });
    }
});
app.get("/playlist/items", async (req, res) => {
    try {
        console.log("track uri: ", req.body.uri);
        const response = await playlist.get(
            access_token.value,
            process.env.TESTING_PLAYLIST_ID
        );
        res.send({ payload: response });
    } catch (err) {
        console.log(err);
        res.send({ error: "failed fetching adding track", status: "error" });
    }
});

app.delete("/playlist/remove", async (req, res) => {
    try {
        console.log("track delete uri: ", req.body.uris[0]);
        const response = await playlist.remove(
            access_token.value,
            process.env.TESTING_PLAYLIST_ID,
            req.body.uris
        );
        res.send({ message: "successfully removed track" });
    } catch (err) {
        console.log(err);
        res.send({ error: "failed removing track" });
    }
});

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
