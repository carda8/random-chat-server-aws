// import { createServer } from "http";
// import { readFileSync } from "fs";
// import express, { NextFunction, Request, Response } from "express";
// import { Server, Socket } from "socket.io";
// import { instrument } from "@socket.io/admin-ui";
// import { config } from "dotenv";
// interface RoomInfo {
//   roomId: string;
//   users: string[];
// }

// interface ResponseMessage {
//   sender: string;
//   message: string;
//   createdAt: Date;
//   roomInfo: RoomInfo;
// }

// const hi = config();

// // const ca = await createCA({
// //   organization: "Hello CA",
// //   countryCode: "NP",
// //   state: "Bagmati",
// //   locality: "Kathmandu",
// //   validity: 365,
// // });

// // const cert = await createCert({
// //   ca: { key: ca.key, cert: ca.cert },
// //   domains: ["127.0.0.1", "localhost", "192.168.219.105"],
// //   validity: 365,
// // });
// // const __dirname = fileURLToPath(new URL(".", import.meta.url));

// // const certPath = path.join(__dirname, "config", "public.pem");
// // const cert = readFileSync(certPath, "utf8");

// // const certKeyPath = path.join(__dirname, "config", "private.pem");
// // const certKey = readFileSync(certKeyPath, "utf8");

// // const privateKey = readFileSync("./src/0.tcp.jp.ngrok.io+4-key.pem", "utf8");
// // const certificate = readFileSync("./src/0.tcp.jp.ngrok.io+4.pem", "utf8");
// // const privateKey = readFileSync("./localhost+2-key.pem", "utf8");
// // const certificate = readFileSync("./localhost+2.pem", "utf8");

// // const credentials = { key: privateKey, cert: certificate };

// const PORT = process.env.PORT;
// const adminUsername = process.env.SOCKET_IO_ADMIN_USERNAME;
// const adminPassword = process.env.SOCKET_IO_ADMIN_PASSWORD;
// // Define a middleware to redirect HTTP to HTTPS
// // function ensureSecure(req: Request, res: Response, next: NextFunction) {
// //   // console.log(req);e
// //   if (req.secure) {
// //     // Request is already secure (HTTPS)
// //     return next();
// //   }
// //   // Redirect to HTTPS version of the URL
// //   res.redirect("https://" + req.hostname + req.originalUrl);
// // }
// const app = express();
// // app.use(ensureSecure);

// const server = createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: [
//       "https://admin.socket.io",
//       "http://localhost:3000",
//       "https://rcn.monkeysforge.com",
//       // "https://randomchatnow.vercel.app",
//     ],
//     // origin: "*", // Allow all origins (for testing purposes)
//     credentials: true,
//   },
// });

// instrument(io, {
//   auth: {
//     type: "basic",
//     username: adminUsername ?? "",
//     password: adminPassword ?? "",
//   },
//   mode: "production",
// });

// app.get("/", (req, res) => res.send("hi!"));
// const rooms: { [key: string]: { users: string[]; active: boolean } } = {};

// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);

//   socket.on("findroom", (data) => {
//     let roomFound = false;

//     for (const room in rooms) {
//       if (rooms[room].users.length === 1 && rooms[room].active) {
//         // 방에 한 명만 있고 방이 활성화 되어 있다면 비어있는 방
//         rooms[room].users.push(socket.id);
//         socket.join(room);
//         roomFound = true;
//         // console.log(`User ${socket.id} joined room ${room}`);
//         io.to(room).emit("matched", {
//           userId: socket.id,
//           users: rooms[room].users,
//           roomId: room,
//         });
//         break;
//       }
//     }

//     // 비어있는 방이 없다면 새로운 방을 생성
//     if (!roomFound) {
//       const newRoom = `room-${socket.id}`;
//       rooms[newRoom] = { users: [socket.id], active: true };
//       socket.join(newRoom);
//       io.to(newRoom).emit("createNewRoom", { room: newRoom });
//       // console.log(`User ${socket.id} created room ${newRoom}`);
//     }
//     // console.log("rooms", rooms);
//   });

//   socket.on("chat", (data) => {
//     // console.log("Message from ", data);
//     const msg: ResponseMessage = {
//       sender: data.sender,
//       message: data.message,
//       createdAt: data.createdAt,
//       roomInfo: data.roomInfo,
//     };
//     io.to(data.roomInfo.roomId).emit("chat", {
//       // sender: socket.id,
//       ...msg,
//     });
//   });

//   socket.on("forceDisconnect", () => {
//     handleDisconnect(socket);
//   });

//   socket.on("disconnect", () => {
//     handleDisconnect(socket);
//   });

//   function handleDisconnect(socket: Socket) {
//     for (const room in rooms) {
//       const index = rooms[room].users.indexOf(socket.id);
//       if (index !== -1) {
//         rooms[room].users.splice(index, 1);
//         socket.leave(room);
//         // console.log(`User ${socket.id} disconnected from room ${room}`);

//         // Mark room as inactive if one user leaves
//         rooms[room].active = false;

//         // If the room is empty, delete it
//         if (rooms[room].users.length === 0) {
//           delete rooms[room];
//           // console.log(`Room ${room} deleted`);
//         } else {
//           // Notify the remaining user that their partner disconnected
//           io.to(room).emit("partnerDisconnected", { room: room });
//         }
//         break;
//       }
//     }
//     // console.log("rooms", rooms);
//   }
// });

// server.listen(PORT, () => console.log("SERVER IS RUNNING"));

// import { createServer } from "https";
// import { createServer as createHttp } from "http";
// import { readFileSync } from "fs";
// import * as dotenv from "dotenv";
// import express, { NextFunction, Request, Response } from "express";
// dotenv.config();

// const app = express();

// const PORT = process.env.PORT;

// // const privateKey = readFileSync("./src/0.tcp.jp.ngrok.io+4-key.pem", "utf8");
// // const certificate = readFileSync("./src/0.tcp.jp.ngrok.io+4.pem", "utf8");
// // const credentials = { key: privateKey, cert: certificate };
// // const server2 = createHttp(app);

// // function ensureSecure(req: Request, res: Response, next: NextFunction) {
// //   // console.log(req);e
// //   if (req.secure) {
// //     // Request is already secure (HTTPS)
// //     return next();
// //   }
// //   // Redirect to HTTPS version of the URL
// //   res.redirect("https://" + req.hostname + req.originalUrl);
// // }
// // app.use(ensureSecure);

// app.get("/", (req: Request, res: Response, next: NextFunction) => {
//   res.send("HI~!");
// });

// // const server = createServer(app);
// app.listen(PORT, () => {});
