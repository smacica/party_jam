const jwt = require("jsonwebtoken");
const { User, Jam, JamUser } = require("@/db/init.js");

async function verifyToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({});
    try {
        const decoded = jwt.verify(token, process.env.APP_SECRET);

        const user = await User.findOne({
            where: { id: decoded.userId },
            raw: true,
        });
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: "Invalid token" });
    }
}

//CREATE SOKET AUTH REQUEST BEFORE CONNECTING TO SOCKETS(THEY WILL ONLY VERIFY JAM USER IN THE DB) 🏁



module.exports = { verifyToken };
