const express = require("express");
const { generateRandomString } = require("@/helper_functions/helpers");
const { access_token, refresh_token } = require("@/spotify/Auth/tokenCache");
const { verifyToken } = require("@/middleware/jwt");
const playlistService = require("@/services/playlistService");

const router = express.Router();

router.post("/add", async (req, res, next) => {
    try {
        const response = await playlistService.add(
            req.body.uri,
            process.env.TESTING_PLAYLIST_ID
        );
        res.send({ message: "successfully added track" });
    } catch (err) {
        next(err);
    }
});
router.get("/items", async (req, res, next) => {
    try {
        const response = await playlistService.getItems(
            process.env.TESTING_PLAYLIST_ID
        );
        res.send({ payload: response });
    } catch (err) {
        next(err);
    }
});

router.delete("/remove", async (req, res, next) => {
    try {
        const response = await playlistService.remove(
            process.env.TESTING_PLAYLIST_ID,
            req.body.uris
        );
        res.send({ message: "successfully removed track" });
    } catch (err) {
        next(err);
    }
});

router.post("/create", verifyToken, async (req, res, next) => {
    try {
        const response = await playlistService.create(req);
        res.send({
            message: "successfully saved your playlist",
            payload: response,
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
