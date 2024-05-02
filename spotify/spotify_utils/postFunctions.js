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
