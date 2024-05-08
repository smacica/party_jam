require("dotenv").config();

const axios = require("axios");
const cors = require("cors");
require("module-alias/register");

const {
    getTracks,
    getArtistData,
    getProfile,
} = require("./spotify/spotify_utils/getFunctions");
const { generateRandomString } = require("./helper_functions/helpers");
const querystring = require("querystring");
const {
    getAccessToken,
    refreshAccessToken,
    getUserAccessToken,
} = require("./spotify/Auth/spotifyOAuth");
const { access_token, refresh_token } = require("@/spotify/Auth/tokenCache");

const { initializeDb, Token } = require("@/db/init");

//express stuff
const express = require("express");

const port = process.env.APP_PORT;
const app = express();

//env imports
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

app.use(cors());

app.get("/", (req, res) => {
    const appleValue = req.query.apple;
    res.send(`Welcome to Party jam! 🎊 apple: ${appleValue}`);
});

app.get("/callback", async (req, res) => {
    try {
        let code = req.query.code || null;
        let state = req.query.state || null;
        const response = await getUserAccessToken(code);
        access_token = response.access_token.value;
        res.send("Authentificated");
    } catch (err) {
        console.log(err.message);
        res.send("Auth Failed");
    }
});

app.get("/login", function (req, res) {
    let state = generateRandomString(16);
    let scope = [
        "user-read-private",
        "user-read-email",
        "user-read-playback-position",
        "user-top-read",
        "user-read-recently-played",
        "playlist-modify-public",
        "playlist-modify-private",
    ].join(" ");

    res.redirect(
        "https://accounts.spotify.com/authorize?" +
            querystring.stringify({
                response_type: "code",
                client_id: clientId,
                scope: scope,
                redirect_uri: redirect_uri,
                state: state,
            })
    );
});

app.get("/profile", async (req, res) => {
    try {
        const response = await getProfile(access_token.value);

        res.json(response);
    } catch (err) {
        console.log(err);
        res.send("fetching profile falied");
    }
});

app.get("/search", async (req, res) => {
    try {
        const query = req.query.q;
        const response = await getTracks(access_token.value, query);

        res.json(response);
    } catch (err) {
        console.log(err);
        res.send("fetching tracks falied");
    }
});

app.listen(port, async () => {
    console.log(`Example app listening on port ${port}`);
    await initializeDb();
    const db_refresh_token = await Token.findByPk("refresh_token");
    console.log("🔑: ", db_refresh_token);

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
