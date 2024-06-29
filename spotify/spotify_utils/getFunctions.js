const axios = require("axios");
const { setCacheParameter } = require("../../helper_functions/helpers");
const { access_token, refresh_token } = require("@/spotify/Auth/tokenCache");

const getArtistData = async () => {
    try {
        const response = await axios.get(
            `https://api.spotify.com/v1/artists/${process.env.ARTHEMAS_ID}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token.value}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error("functions getArtistData failed");
    }
};

const getProfile = async () => {
    try {
        const response = await axios.get("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${access_token.value}`,
            },
        });

        return response.data;
    } catch (err) {
        throw new Error("Failed fetching Profile");
    }
};

const getTracks = async (query) => {
    try {
        const response = await axios.get("https://api.spotify.com/v1/search", {
            params: {
                q: query,
                type: "track",
                limit: 20,
            },
            headers: {
                Authorization: `Bearer ${access_token.value}`,
            },
        });
        return response.data;
    } catch (err) {
        throw new Error("Failed getting Tracks");
    }
};

module.exports = {
    getArtistData,
    getProfile,
    getTracks,
};
