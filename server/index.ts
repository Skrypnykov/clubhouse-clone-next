import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sharp from "sharp";
import fs from "fs";

import { Axios } from "../core/axios";
import { Code } from "../models";
import { uploader } from "./core/uploader";
import { passport } from "./core/passport";

dotenv.config({
  path: "server/.env",
});

import "./core/db";

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.get("/todos", (req, res) => {
  res.send("Hello");
});

app.post("/upload", uploader.single("photo"), (req, res) => {
  const filePath = req.file.path;
  sharp(filePath)
    .resize(150, 150) // змінюємо розмір файлу, що завантажується
    .toFormat("webp")
    .toFile(filePath.replace(/\.[^/.]+$/, ".webp"), (err) => {
      // конвертує в webp
      if (err) {
        throw err;
      }
      fs.unlinkSync(filePath); // видаляє початковий файл
      res.json({
        url: `/avatars/${req.file.filename.replace(/\.[^/.]+$/, ".webp")}`, // конвертує в webp на backend-e
      });
    });
});

const randomCode = (max: number = 9999, min: number = 1000) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

app.get(
  "/auth/me",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

// перевірка та видалення кода активації
app.get(
  "/auth/sms/activate",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const userId = req.user.id;
    const smsCode = req.query.code;

    if (!smsCode) {
      return res.status(400).send();
    }

    const whereQuery = { code: smsCode, user_id: userId };

    try {
      const findCode = await Code.findOne({
        where: whereQuery,
      });

      if (findCode) {
        await Code.destroy({
          where: whereQuery,
        });
        // TODO: Активувати користувача isActive = 1
        return res.send();
      } else {
        throw new Error("Користувач не знайдений");
      }
    } catch (error) {
      res.status(500).json({
        message: "Помилка активації облікового запису",
      });
    }
  }
);

// строрення кода активації та відправка SMS
app.get(
  "/auth/sms",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const phone = req.query.phone;
    const userId = req.user.id;
    const smsCode = randomCode();

    if (!phone) {
      return res.status(400).json({
        message: "Номер телефону не вказано",
      });
    }

    try {
      await Axios.get(
        `https://api.turbosms.ua/message/send.json?token=${process.env.SMS_API_KEY}&recipients[0]=${phone}&sms[sender]=SOG&sms[text]=${smsCode}`
      );

      const findCode = await Code.findOne({
        where: {
          user_id: userId,
        },
      });

      if (findCode) {
        return res.status(400).json({
          message: "Код вже було відправлено",
        });
      }

      await Code.create({
        code: smsCode,
        user_id: userId,
      });

      res.status(201).send();
    } catch (error) {
      res.status(500).json({
        message: "Помилка під час відправлення SMS-коду",
      });
    }
  }
);

app.get("/auth/github", passport.authenticate("github"));

app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.send(
      `<script>window.opener.postMessage('${JSON.stringify(
        req.user
      )}', '*');window.close();</script>`
    );
  }
);

app.listen(3001, () => {
  console.log("SERVER RUNNED!");
});
