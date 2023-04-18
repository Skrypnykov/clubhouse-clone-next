import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sharp from "sharp";
import fs from "fs";

import { uploader } from "./core/uploader";
import { passport } from "./core/passport";
import AuthController from "./controllers/AuthController";

dotenv.config({
  path: "server/.env",
});

import "./core/db";

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.get(
  "/auth/me",
  passport.authenticate("jwt", { session: false }),
  AuthController.getMe
);

// перевірка та видалення кода активації
app.get(
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

app.listen(3001, () => {
  console.log("SERVER RUNNED!");
});
