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

const player = require("@/services/playerService");
//env imports
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

router.get("/app/playback", async (req, res) => {
    try {
        const response = "playback";
        res.json({ payload: response });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "fetching profile falied" });
    }
});

router.get("/qeue", async (req, res) => {
    try {
        const response = await player.getQeueSpotify();
        res.json({ payload: response });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "fetching profile falied" });
    }
});

router.post("/qeue/add", async (req, res) => {
    try {
        const response = await player.addQeueSpotify(req);
        res.json({ payload: response });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "fetching profile falied" });
    }
});

router.get("/pause", async (req, res) => {
    try {
        const response = await player.pauseSpotify(req);
        res.json({ payload: response });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "fetching profile falied" });
    }
});

module.exports = router;
