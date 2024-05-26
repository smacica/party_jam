const axios = require("axios");
const fs = require("fs");
const { setCacheParameter } = require("@/helper_functions/helpers");
const { Token } = require("@/db/init.js");

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            {
                grant_type: "refresh_token",
                refresh_token: refreshToken,
                client_id: clientId,
            },
            {
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    Authorization:
                        "Basic " +
                        new Buffer.from(clientId + ":" + clientSecret).toString(
                            "base64"
                        ),
                },
                json: true,
            }
        );

        if (response.data.refresh_token) {
            await Token.upsert({
                type: "access_token",
                value: response.data.access_token,
            });
            await Token.upsert({
                type: "refresh_token",
                value: response.data.refresh_token,
            });
        } else {
            await Token.upsert({
                type: "access_token",
                value: response.data.access_token,
            });
        }

        return response.data;
    } catch (error) {
        throw error;
    }
};

const getUserAccessToken = async (code) => {
    try {
        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: "authorization_code",
            },
            {
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    Authorization:
                        "Basic " +
                        new Buffer.from(clientId + ":" + clientSecret).toString(
                            "base64"
                        ),
                },
                json: true,
            }
        );
        if (response.data.refresh_token) {
            await Token.upsert({
                type: "access_token",
                value: response.data.access_token,
            });
            await Token.upsert({
                type: "refresh_token",
                value: response.data.refresh_token,
            });
        } else {
            await Token.upsert({
                type: "access_token",
                value: response.data.access_token,
            });
        }

        return response.data;
    } catch (err) {
        throw err;
    }
};

const getAccessToken = async () => {
    try {
        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            {
                grant_type: "client_credentials",
                client_id: clientId,
                client_secret: clientSecret,
            },
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        await Token.upsert({
            type: "access_token",
            value: response.data.access_token,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

module.exports = { refreshAccessToken, getAccessToken, getUserAccessToken };
