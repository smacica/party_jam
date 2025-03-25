const express = require("express");
const {
    generateRandomString,
    splitToNChunks,
} = require("@/helper_functions/helpers");
const { access_token, refresh_token } = require("@/spotify/Auth/tokenCache");
const {registerSocketGuest, registerSocketUser} = require("@/middleware/JamAuth");
const verifyToken = require("@/middleware/jwt");

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
router.post("/get-token", jamAuth, async (res, req) => {
    try {
        const token = req.cookies.token;
        let jam_token;
        if (!token) {
            jam_token = await registerSocketGuest(req);
        }else{
            jam_token = await registerSocketUser(req);
        }

        res.cookie("jam_token", jam_token, {
            expires: new Date(Date.now() + 100 * 30 * 60000), // time until expiration
            secure: false, // set to true if you're using https
            httpOnly: true,
        });
        res.json({
            message: "Succesfully register jam user!",
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: "Failed jam registration" });
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
