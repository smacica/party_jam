const express = require("express");
const { generateRandomString } = require("@/helper_functions/helpers");
const { getUserAccessToken } = require("@/services/spotify/AuthService.js");

const querystring = require("querystring");
const router = express.Router();

const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const { verifyToken } = require("@/middleware/jwt");

router.post("/authentificate", verifyToken, async (req, res) => {
    try {
        let code = req.body.code;
        let state = req.body.state || null;
        const response = await getUserAccessToken(code, req.user.id);

        res.send({ message: "Succesfully connected spotify!" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: "Auth Failed" });
    }
});

router.get("/grant-access", function (req, res) {
    let state = generateRandomString(16);
    let scope = [
        "user-read-private",
        "user-read-email",
        "user-read-playback-position",
        "user-top-read",
        "user-read-recently-played",
        "playlist-modify-public",
        "playlist-modify-private",
        "user-read-currently-playing",
        "user-read-playback-state",
        "user-modify-playback-state",

        "app-remote-control",
        "streaming",
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

module.exports = router;
