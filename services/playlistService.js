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

const add = async (uri, playlist_id) => {
    try {
        const response = await axios.post(
            `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
            {
                uris: [uri],
                position: 0,
            },
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

const addItemsSpotify = async (uris, playlist_id) => {
    try {
        const division = Math.floor(uris.length / 100);
        let uris_chunks = [];
        if (uris.length % 100 == 0) {
            uris_chunks = splitToNChunks(uris, division);
        } else if (division >= 1) {
            uris_chunks = splitToNChunks(uris, division + 1);
        } else if (division < 1) {
            uris_chunks = splitToNChunks(uris, 1);
        }

        const promises = uris_chunks.map((uris_chunk) => {
            return axios.post(
                `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
                {
                    uris: uris_chunk,
                    position: 0,
                },
                {
                    headers: {
                        Authorization: `Bearer ${access_token.value}`,
                    },
                }
            );
        });

        await Promise.all(promises);

        return { message: "done" };
    } catch (err) {
        throw err;
    }
};

const removeItemsSpotify = async (uris, playlist_id) => {
    try {
        const division = Math.floor(uris.length / 100);
        let uris_chunks = [];
        if (uris.length % 100 == 0) {
            uris_chunks = splitToNChunks(uris, division);
        } else if (division > 1) {
            uris_chunks = splitToNChunks(uris, division + 1);
        } else if (division < 1) {
            uris_chunks = splitToNChunks(uris, 1);
        }

        const promises = uris_chunks.map((uris_chunk) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const response = await axios.delete(
                        `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
                        {
                            data: {
                                tracks: uris_chunk.map((uri) => {
                                    return { uri: uri };
                                }),
                            },
                            headers: {
                                Authorization: `Bearer ${access_token.value}`,
                            },
                        }
                    );
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });

        await Promise.all(promises);

        return { message: "done" };
    } catch (err) {
        throw err;
    }
};

const getItemsSpotify = async (playlist_id) => {
    try {
        const limit = 50;
        const response = await axios.get(
            `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
            {
                params: {
                    limit: limit,
                    fields: "offset,total,items(track(id,uri))",
                },

                headers: {
                    Authorization: `Bearer ${access_token.value}`,
                },
            }
        );
        let tracks = response.data.items;
        const total_tracks = response.data.total;
        const offset_count = getOffsetCount(limit, total_tracks);
        if (offset_count > 1) {
            const number_of_requests = offset_count - 1;

            const items_promises = [...Array(number_of_requests)].map((i) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const responseTracks = await axios.get(
                            `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
                            {
                                params: {
                                    limit: limit,
                                    fields: "offset,total,items(track(id,uri))",
                                },

                                headers: {
                                    Authorization: `Bearer ${access_token.value}`,
                                },
                            }
                        );
                        tracks = tracks.concat(responseTracks.data.items);
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                });
            });
            await Promise.all(items_promises);
        }
        return tracks;
    } catch (err) {
        // throw new Error("Failed fetching playlist items");
        throw err;
    }
};

const remove = async (playlist_id, uris) => {
    try {
        const delete_tracks = uris.map((track_uri) => {
            return { uri: track_uri };
        });
        console.log(delete_tracks);
        const response = await axios.delete(
            `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
            {
                data: {
                    tracks: delete_tracks,
                },
                headers: {
                    Authorization: `Bearer ${access_token.value}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (err) {
        throw new Error("Failed removing track from playlist");
    }
};

const getPlaylist = async (playlist_id) => {
    try {
        const response = await axios.get(
            `https://api.spotify.com/v1/playlists/${playlist_id}`,
            {
                params: {
                    fields: "tracks",
                    limit: "30",
                },
                headers: {
                    Authorization: `Bearer ${access_token.value}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (err) {
        throw new Error("Failed fetching Playlist");
    }
};

const create = async (request) => {
    try {
        const playlist = await Playlist.findOne({
            where: { id: request.body.playlist_id },
            raw: true,
        });
        if (playlist) {
            return playlist;
        }

        const response = await axios.get(
            `https://api.spotify.com/v1/playlists/${request.body.playlist_id}`,
            {
                params: {
                    fields: "collaborative,description,external_urls, followers, href, id, images, name, owner(id), public, snapshot_id, type, uri",
                },
                headers: {
                    Authorization: `Bearer ${access_token.value}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const store_playlist = { ...response.data };

        store_playlist.owner_id = response.data.owner.id;
        store_playlist.user_id = request.user.id;

        console.log("😃", store_playlist);

        await Playlist.create({ ...store_playlist });
        return store_playlist;
    } catch (err) {
        console.log(err);
        throw new Error("Failed saving source playlist");
    }
};

module.exports = {
    getItemsSpotify,
    remove,
    add,
    getPlaylist,
    create,
    addItemsSpotify,
    removeItemsSpotify,
};
