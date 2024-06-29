const express = require("express");
const {
    generateRandomString,
    splitToNChunks,
} = require("@/helper_functions/helpers");
const { access_token, refresh_token } = require("@/spotify/Auth/tokenCache");
const { verifyToken } = require("@/middleware/jwt");
const jamService = require("@/services/jamService");

const router = express.Router();

router.post("/create", verifyToken, async (req, res, next) => {
    try {
        const response = await jamService.create(req);
        res.send({
            message: "successfully created your jam!",
            payload: response,
        });
    } catch (err) {
        next(err);
    }
});

router.get("/jam", verifyToken, async (req, res, next) => {
    try {
        const response = await jamService.create(req);
        res.send({
            message: "successfully created your jam!",
            payload: response,
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
