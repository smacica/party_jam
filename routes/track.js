const express = require("express");
const { generateRandomString } = require("@/helper_functions/helpers");
const { access_token, refresh_token } = require("@/spotify/Auth/tokenCache");
const {
    getTracks,
    getArtistData,
    getProfile,
} = require("@/spotify/spotify_utils/getFunctions");

const router = express.Router();

router.get("/search", async (req, res, next) => {
    try {
        const query = req.query.q;

        const response = await getTracks(query);

        res.json({ payload: response });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
