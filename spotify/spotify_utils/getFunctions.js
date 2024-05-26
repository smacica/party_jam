const axios = require("axios");
const { setCacheParameter } = require("../../helper_functions/helpers");

const getArtistData = async (accessToken) => {
    try {
        const response = await axios.get(
            `https://api.spotify.com/v1/artists/${process.env.ARTHEMAS_ID}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error("functions getArtistData failed");
    }
};

const getProfile = async (accessToken) => {
    try {
        const response = await axios.get("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;
    } catch (err) {
        throw err;
    }
};

const getTracks = async (accessToken, query) => {
    try {
        const response = await axios.get("https://api.spotify.com/v1/search", {
            params: {
                q: query,
                type: "track",
                limit: 20,
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    getArtistData,
    getProfile,
    getTracks,
};
