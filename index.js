require("dotenv").config();

const axios = require("axios");

const {
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

//express stuff
const express = require("express");

const port = process.env.APP_PORT;
const app = express();

//env imports
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
let access_token = "";

app.get("/", (req, res) => {
    const appleValue = req.query.apple;
    res.send(`Welcome to Party jam! 🎊 apple: ${appleValue}`);
});

app.get("/callback", async (req, res) => {
    try {
        let code = req.query.code || null;
        let state = req.query.state || null;
        const response = await getUserAccessToken(code);
        access_token = response.access_token;
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
        const response = await getProfile(access_token);

        res.json(response);
    } catch (err) {
        console.log(err);
        res.send("fetching profile falied");
    }
});

app.listen(port, async () => {
    console.log(`Example app listening on port ${port}`);
    let cache = require("./data_cache.json");
    if (cache.refresh_token) {
        try {
            const response = await refreshAccessToken(cache.refresh_token);
            access_token = response.access_token;
            setInterval(async () => {
                const response = await refreshAccessToken(cache.refresh_token);
                access_token = response.access_token;
                console.log("refreshed token");
            }, 3000000);
        } catch (err) {
            console.log(err.message);
        }
    }
});
