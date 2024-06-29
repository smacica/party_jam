const axios = require("axios");
const {
    setCacheParameter,
    getOffsetCount,
    splitToNChunks,
} = require("../helper_functions/helpers");
const { access_token, refresh_token } = require("@/spotify/Auth/tokenCache");
const { param } = require("@/routes/Auth");
const { Playlist } = require("@/db/init");
const { raw } = require("express");

const getQeue = async (request) => {
    try {
        const response = await axios.get(
            `https://api.spotify.com/v1/me/player/queue`,
            {
                headers: {
                    Authorization: `Bearer ${access_token.value}`,
                },
            }
        );
        return response.data;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    getQeue,
};
