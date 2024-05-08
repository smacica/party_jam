class AccessToken {
    constructor(accessToken) {
        this.accessToken = accessToken;
    }

    get value() {
        return this.accessToken;
    }

    update(newAccessToken) {
        this.accessToken = newAccessToken;
    }
}

class RefreshToken {
    constructor(refreshToken) {
        this.refreshToken = refreshToken;
    }

    get value() {
        return this.refreshToken;
    }

    update(newRefreshToken) {
        this.refreshToken = newRefreshToken;
    }
}
const access_token = new AccessToken();
const refresh_token = new RefreshToken();

module.exports = {
    access_token,
    refresh_token,
};
