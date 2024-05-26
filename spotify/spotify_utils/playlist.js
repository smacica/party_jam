const axios = require("axios");
const { setCacheParameter } = require("../../helper_functions/helpers");

const add = async (accessToken, uri, playlist_id) => {
    try {
        const response = await axios.post(
            `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
            {
                uris: [uri],
                position: 0,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (err) {
        throw err;
    }
};

const get = async (accessToken, playlist_id) => {
    try {
        const response = await axios.get(
            `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
            {
                params: {
                    limit: 50,
                    fields: "items(track(id,uri))",
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (err) {
        throw err;
    }
};

const remove = async (accessToken, playlist_id, uris) => {
    try {
        const delete_tracks = uris.map((track_uri) => {
            return { uri: track_uri };
        });
        const response = await axios.delete(
            `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
            {
                data: {
                    tracks: delete_tracks,
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    get,
    remove,
    add,
};
