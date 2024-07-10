"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Socket's Setup
const socket_io_1 = require("socket.io");
const socketInit = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });
    return io;
};
exports.default = socketInit;
