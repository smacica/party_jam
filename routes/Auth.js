const express = require("express");
const { generateRandomString } = require("@/helper_functions/helpers");
const { access_token, refresh_token } = require("@/spotify/Auth/tokenCache");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("@/db/init.js");
const { verifyToken } = require("@/middleware/jwt");

router.post("/register", async (req, res) => {
    try {
        const { username, password, email } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ email, username, password: hashedPassword });
        res.json({ message: "User registered successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Registration failed" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email: email }, raw: true });
        if (!user) {
            return res.status(401).json({ error: "No user with that email" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "bad password" });
        }
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET, {
            expiresIn: "100h",
        });

        userData = { ...user };
        delete userData.password;

        res.cookie("token", token, {
            expires: new Date(Date.now() + 100 * 30 * 60000), // time until expiration
            secure: false, // set to true if you're using https
            httpOnly: true,
        });

        res.status(200).json({
            payload: userData,
            message: "Successfully logged in!",
        });
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
});

router.get("/profile", verifyToken, async (req, res) => {
    try {
        const userData = { ...req.user };
        delete userData.password;

        res.status(200).json({
            payload: userData,
        });
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
});
router.post("/logout", verifyToken, async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({
            message: "Succesfully logged out!",
            payload: {
                id: "",
                username: "",
                email: "",
                isActive: 0,
                createdAt: "",
                deletedAt: null,
                updatedAt: "",
                role: "",
            },
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to logout" });
    }
});

module.exports = router;
