const axios = require("axios");
const {
    setCacheParameter,
    getOffsetCount,
    splitToNChunks,
} = require("../helper_functions/helpers");
const { access_token, refresh_token } = require("@/spotify/Auth/tokenCache");
const { param } = require("@/routes/Auth");
const { JamPlaylist, JamTrack } = require("@/db/init");

const playlistService = require("@/services/playlistService");
const { raw } = require("express");

const create = async (request) => {
    //create playlist
    //copy tracks from appropriate album
    try {
        let jam_playlist = await JamPlaylist.findOne({
            where: { user_id: request.user.id },
            raw: true,
        });

        if (!jam_playlist) {
            const playlistCopyResponse = await axios.post(
                `https://api.spotify.com/v1/users/${process.env.USER_ID}/playlists`,
                {
                    name: `${request.user.email}'s party jam`,
                    description: "Playlist created by party jam",
                    public: true,
                },
                {
                    headers: {
                        Authorization: `Bearer ${access_token.value}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            //get tracks from playlist id
            //save them to the jam_tracks in table

            const store_playlist = { ...playlistCopyResponse.data };

            store_playlist.owner_id = playlistCopyResponse.data.owner.id;
            store_playlist.user_id = request.user.id;

            await JamPlaylist.create({ ...store_playlist });
            jam_playlist = store_playlist;
        }

        const tracks_to_delete = await JamTrack.findAll({
            where: {
                jam_playlist_id: jam_playlist.id,
            },
            raw: true,
        });

        await playlistService.removeItemsSpotify(
            tracks_to_delete.map((item) => item.uri),
            jam_playlist.id
        );

        await JamTrack.destroy({
            where: {
                jam_playlist_id: jam_playlist.id,
            },
        });

        const playlist_tracks = await playlistService.getItemsSpotify(
            request.body.playlist_id
        );

        await playlistService.addItemsSpotify(
            playlist_tracks.map((item) => item.track.uri),
            jam_playlist.id
        );
        // const length_of_playlist = playlist_tracks.length;
        // await playlistService.addItemsSpotify(
        //     [
        //         playlist_tracks[getRandomInt(length_of_playlist)].track.uri,
        //         playlist_tracks[getRandomInt(length_of_playlist)].track.uri,
        //     ],
        //     jam_playlist.id
        // );

        await JamTrack.bulkCreate(
            playlist_tracks.map((item) => {
                return {
                    uri: item.track.uri,
                    original: true,
                    jam_playlist_id: jam_playlist.id,
                };
            })
        );

        return jam_playlist;
    } catch (err) {
        console.log(err);
        throw new Error("Failed saving source playlist");
    }
};

const createJam = async (req) => {};

module.exports = { create };
