const express = require("express");
const { generateRandomString } = require("@/helper_functions/helpers");
const { access_token, refresh_token } = require("@/spotify/Auth/tokenCache");

const {
    getAccessToken,
    refreshAccessToken,
    getUserAccessToken,
} = require("@/spotify/Auth/spotifyOAuth");
const querystring = require("querystring");
const router = express.Router();

const {
    getTracks,
    getArtistData,
    getProfile,
} = require("@/spotify/spotify_utils/getFunctions");
//env imports
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

router.get("/callback", async (req, res) => {
    try {
        let code = req.query.code || null;
        let state = req.query.state || null;
        const response = await getUserAccessToken(code);
        access_token.update(response.access_token);
        res.send({ message: "Authentificated" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: "Auth Failed" });
    }
});

router.get("/app/login", function (req, res) {
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

router.get("/app/profile", async (req, res) => {
    try {
        const response = await getProfile();

        res.json({ payload: response });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "fetching profile falied" });
    }
});
