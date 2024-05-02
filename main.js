require("dotenv").config();

const axios = require("axios");
const { getAccessToken } = require("./spotify/Auth/spotifyOAuth");
const {
    getArtistData,
    getProfile,
} = require("./spotify/spotify_utils/getFunctions");

let accessToken = "";

const main = async () => {
    try {
        const accessTokenData = await getAccessToken();
        accessToken = accessTokenData.access_token;

        if (!accessToken) throw new Error("No access token!");

        const artistData = await getArtistData(accessToken);

        console.log(artistData);
    } catch (err) {
        console.log(err.message);
    }
};

if (require.main === module) {
    main();
}
