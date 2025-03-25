const { Server } = require("socket.io");
function connectSockets(httpServer){
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true,
            allowedHeaders: ["token", "jam_token"],
        },
    });

    io.on("connection", (socket) => {
        try{
            // const auth_token = cookie.parse(socket.handshake.headers.cookie).token;
            const auth_token = socket.handshake.headers.cookie
            console.log("🙂", auth_token);
            socket.emit("welcome", "You have connected to the party jam server!🎊");
            socket.on("join_room", (room_id) => {});
            socket.on("get_data", () => {});
        }catch(err){
            console.log(err)
        }
        
    });
}

module.exports = connectSockets