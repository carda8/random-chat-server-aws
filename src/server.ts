import { createServer } from "http";
import { readFileSync } from "fs";
import express, { NextFunction, Request, Response } from "express";
import { Server, Socket } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import { config } from "dotenv";
interface RoomInfo {
  roomId: string;
  users: string[];
}

interface ResponseMessage {
  sender: string;
  message: string;
  createdAt: Date;
  roomInfo: RoomInfo;
}

config();

const PORT = process.env.PORT;
const adminUsername = process.env.SOCKET_IO_ADMIN_USERNAME;
const adminPassword = process.env.SOCKET_IO_ADMIN_PASSWORD;

const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "https://admin.socket.io",
      "http://localhost:3000",
      "https://rcn.monkeysforge.com",
    ],
    // origin: "*", // Allow all origins (for testing purposes)
    credentials: true,
  },
});

instrument(io, {
  auth: {
    type: "basic",
    username: adminUsername ?? "",
    password: adminPassword ?? "",
  },
  mode: "production",
});

app.get("/", (req, res) => res.send("hi!"));
const rooms: { [key: string]: { users: string[]; active: boolean } } = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("findroom", (data) => {
    let roomFound = false;

    for (const room in rooms) {
      if (rooms[room].users.length === 1 && rooms[room].active) {
        // 방에 한 명만 있고 방이 활성화 되어 있다면 비어있는 방
        rooms[room].users.push(socket.id);
        socket.join(room);
        roomFound = true;
        io.to(room).emit("matched", {
          userId: socket.id,
          users: rooms[room].users,
          roomId: room,
        });
        break;
      }
    }

    // 비어있는 방이 없다면 새로운 방을 생성
    if (!roomFound) {
      const newRoom = `room-${socket.id}`;
      rooms[newRoom] = { users: [socket.id], active: true };
      socket.join(newRoom);
      io.to(newRoom).emit("createNewRoom", { room: newRoom });
    }
  });

  socket.on("chat", (data) => {
    const msg: ResponseMessage = {
      sender: data.sender,
      message: data.message,
      createdAt: data.createdAt,
      roomInfo: data.roomInfo,
    };
    io.to(data.roomInfo.roomId).emit("chat", {
      // sender: socket.id,
      ...msg,
    });
  });

  socket.on("forceDisconnect", () => {
    handleDisconnect(socket);
  });

  socket.on("disconnect", () => {
    handleDisconnect(socket);
  });

  function handleDisconnect(socket: Socket) {
    for (const room in rooms) {
      const index = rooms[room].users.indexOf(socket.id);
      if (index !== -1) {
        rooms[room].users.splice(index, 1);
        socket.leave(room);

        // Mark room as inactive if one user leaves
        rooms[room].active = false;

        // If the room is empty, delete it
        if (rooms[room].users.length === 0) {
          delete rooms[room];
        } else {
          // Notify the remaining user that their partner disconnected
          io.to(room).emit("partnerDisconnected", { room: room });
        }
        break;
      }
    }
  }
});

server.listen(PORT, () => console.log("SERVER IS RUNNING"));
