const jwt = require("jsonwebtoken");
const { User, Jam, JamUser } = require("@/db/init.js");
const { Model } = require("sequelize");

async function jamAuth(req, res, next) {
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
}

async function registerSocketGuest(req) {
    jam_id = req.body.jam_id;
    nickname = req.body.nickname;

    const jam_user = await JamUser.create({
        jam_id: jam_id,
        nickname: nickname,
        role: "voter",
    });

    const guest_token = jwt.sign(
        { jamUserId: jam_user.id },
        process.env.APP_SECRET,
        {
            expiresIn: "100h",
        }
    );
    return guest_token;
}

async function registerSocketUser(req) {
    const token = req.cookies.token;
    jam_id = req.body.jam_id;

    const jam = Jam.findOne({
        where: { id: jam_id },
        raw: true,
    });

    const decoded = jwt.verify(token, process.env.APP_SECRET);

    const user = await User.findOne({
        where: { id: decoded.userId },
        raw: true,
    });

    const userIsOwner = user.id === jam.id;

    if (!user || !userIsOwner) {
        const jam_user = await JamUser.create({
            jam_id: jam_id,
            nickname: nickname,
            role: "voter",
        });

        const guest_token = jwt.sign(
            { jamUserId: jam_user.id },
            process.env.APP_SECRET,
            {
                expiresIn: "100h",
            }
        );
        return guest_token;
    }

    const jam_user = await JamUser.create({
        jam_id: jam_id,
        nickname: nickname,
        role: "owner",
    });
    const owner_token = jwt.sign(
        { jamUserId: jam_user.id },
        process.env.APP_SECRET,
        {
            expiresIn: "100h",
        }
    );
    return owner_token;
}

module.exports = {registerSocketGuest, registerSocketUser}