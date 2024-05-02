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
        throw error;
    }
};

const getProfile = async (accessToken) => {
    try {
        const response = await axios.get("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        setCacheParameter(["user_id"], [response.data.id]);
        return response.data;
    } catch (err) {
        throw err;
    }
};

module.exports = { getArtistData, getProfile };
