import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sharp from "sharp";
import fs from "fs";
import socket from 'socket.io';
import { createServer } from 'http';

import { uploader } from "./core/uploader";
import { passport } from "./core/passport";
import AuthController from "./controllers/AuthController";
import RoomController from "./controllers/RoomController";
import { Room } from "../models";
import { getUsersFromRoom, SocketRoom } from "../utils/getUsersFromRoom";

dotenv.config({
  path: "server/.env",
});

import "./core/db";

const color = require("colors");  // colored logs

const port = process.env.SERVER_PORT || 3001;

const app = express();
const httpServer = createServer(app);
const io = socket(httpServer, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.get(
  "/rooms",
  passport.authenticate("jwt", { session: false }),
  RoomController.index
);
app.post(
  "/rooms",
  passport.authenticate("jwt", { session: false }),
  RoomController.create
);
app.get(
  "/room/:id",
  passport.authenticate("jwt", { session: false }),
  RoomController.show
);
app.delete(
  "/room/:id",
  passport.authenticate("jwt", { session: false }),
  RoomController.delete
);

app.get(
  "/profile/:id",
  passport.authenticate("jwt", { session: false }),
  AuthController.getUserInfo
);

app.get(
  "/auth/me",
  passport.authenticate("jwt", { session: false }),
  AuthController.getMe
);

// перевірка та видалення кода активації
app.post(
  "/auth/sms/activate",
  passport.authenticate("jwt", { session: false }),
  AuthController.activate
);

// створення кода активації та відправка SMS
app.get(
  "/auth/sms",
  passport.authenticate("jwt", { session: false }),
  AuthController.sendSMS
);

// аутентифікація через GitHub
app.get("/auth/github", passport.authenticate("github"));

app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/login",
  }),
  AuthController.authCallback
);

// завантаження файлу аватарки
app.post("/upload", uploader.single("photo"), (req, res) => {
  const filePath = req.file.path;
  sharp(filePath)
    .resize(150, 150) // змінюємо розмір файлу, що завантажується
    .toFormat("webp")
    // конвертує в .webp на frontend-і
    .toFile(filePath.replace(/\.[^/.]+$/, ".webp"), (err) => {
      if (err) {
        throw err;
      }
      fs.unlinkSync(filePath); // видаляє початковий файл
      res.json({
        url: `/avatars/${req.file.filename.replace(/\.[^/.]+$/, ".webp")}`, // конвертує в .webp на backend-і
      });
    });
});

// Конфигурація socket.io
export const rooms: SocketRoom = {};

io.on("connection", (socket) => {
  console.log(color.yellow("ПІДКЛЮЧЕННЯ ДО СОКЕТA:", socket.id));

  socket.on("CLIENT@ROOMS:JOIN", ({ user, roomId }) => {
    socket.join(`room/${roomId}`);
    rooms[socket.id] = { roomId, user };
    const speakers = getUsersFromRoom(rooms, roomId);
    io.emit("SERVER@ROOMS:HOME", { roomId: Number(roomId), speakers });
    io.in(`room/${roomId}`).emit("SERVER@ROOMS:JOIN", speakers);
    Room.update({ speakers }, { where: { id: roomId } });

    console.log(
      color.bgGreen(` ${user.fullname} ` + `увійшов до кімнати` + ` ${roomId} `)
    );
  });

  socket.on(
    "CLIENT@ROOMS:CALL",
    ({ targetUserId, callerUserId, roomId, signal }) => {
      socket.broadcast.to(`room/${roomId}`).emit("SERVER@ROOMS:CALL", {
        targetUserId,
        callerUserId,
        signal,
      });
    }
  );

  socket.on(
    "CLIENT@ROOMS:ANSWER",
    ({ targetUserId, callerUserId, roomId, signal }) => {
      socket.broadcast.to(`room/${roomId}`).emit("SERVER@ROOMS:ANSWER", {
        targetUserId,
        callerUserId,
        signal,
      });
    }
  );

  socket.on("disconnect", () => {
    //console.log('USERS:',  rooms);
    if (rooms[socket.id]) {
      const { roomId, user } = rooms[socket.id];
      socket.broadcast.to(`room/${roomId}`).emit("SERVER@ROOMS:LEAVE", user);
      delete rooms[socket.id];
      const speakers = getUsersFromRoom(rooms, roomId);
      io.emit("SERVER@ROOMS:HOME", { roomId: Number(roomId), speakers });
      Room.update({ speakers }, { where: { id: roomId } });

      console.log(
        color.bgBlue(` ${user.fullname}` + ` вийшов із кімнати ` + `${roomId} `)
      );
    }
  });
});

httpServer.listen(port, () => {
  console.log(
    color.green.bold(`SERVER IS RUNNING at: http://localhost:${port}`)
  );
});
