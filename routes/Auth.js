const express = require("express");
const { generateRandomString } = require("@/helper_functions/helpers");

const router = express.Router();

app.get("app/login", function (req, res) {
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

module.exports = router;
