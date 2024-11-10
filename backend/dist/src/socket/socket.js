import { Server } from "socket.io";
import http from "http";
import express from "express";
import { configDotenv } from "dotenv";
const app = express();
configDotenv();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://textbox.quicklit.in"],
        methods: ["GET", "POST"],
    }
});
export const getRecieverSocketId = (recieverId) => {
    return userSocketMap[recieverId];
};
const userSocketMap = {}; // {userId: socketId}
io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    const userId = socket.handshake.query.userId;
    console.log('userId query', userId);
    console.log('usersocketmap before userId', userSocketMap);
    if (userId)
        userSocketMap[userId] = socket.id;
    console.log('usersocketmap after userId', userSocketMap);
    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    // socket.on() is used to listen to the EventSource. can be used both on client and server side
    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        console.log("obj remaining", userSocketMap);
        delete userSocketMap[userId];
        console.log("delete connection key and socket value", userId, socket.id);
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});
export { app, io, server };
