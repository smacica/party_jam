const axios = require("axios");
const {
    setCacheParameter,
    getOffsetCount,
    splitToNChunks,
} = require("../helper_functions/helpers");
const { access_token, refresh_token } = require("@/spotify/Auth/tokenCache");
const { param } = require("@/routes/Auth");
const { JamPlaylist, JamTrack, Jam } = require("@/db/init");

const playlistService = require("@/services/playlistService");
const { raw } = require("express");

const create = async (request) => {
    //creates jam
    //copy tracks from appropriate album
    try {
        await Jam.destroy({
            where: { user_id: request.user.id },
        });
        const jam = await Jam.create({
            user_id: request.user.id,
            name: request.body.name || `${request.user.name}'s jam`,
        });

        return jam;
    } catch (err) {
        console.log(err);
        throw new Error("Failed creating Jam");
    }
};

module.exports = { create };
