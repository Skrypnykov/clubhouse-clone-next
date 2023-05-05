import express from "express";
import { Axios } from "../../core/axios";
import { Code, User } from "../../models";

import { generateRandomCode } from "../../utils/generateRandomCode";

class AuthController {
  getMe(req: express.Request, res: express.Response) {
    res.json(req.user);
  }

  // аутентифікація через GitHub
  authCallback(req: express.Request, res: express.Response) {
    res.send(
      `<script>window.opener.postMessage('${JSON.stringify(
        req.user
      )}', '*');window.close();</script>`
    );
  }

  // перевірка, активація та видалення кода активації
  async activate(req: express.Request, res: express.Response) {
    const userId = req.user.id;
    const { user, code } = req.body;

    if (!code) {
      return res.status(400).send({ message: "Введіть код активації" });
    }

    const whereQuery = { code, user_id: userId };

    try {
      const findCode = await Code.findOne({
        where: whereQuery,
      });

      if (findCode) {
        await Code.destroy({
          // видалення коду из бази після активації
          where: whereQuery,
        });
        await User.update({ ...user, isActive: 1 }, { where: { id: userId } }); // активація користувача
        return res.send();
      } else {
        res.status(400).json({
          message: "Код не знайдено",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Помилка активації облікового запису",
      });
    }
  }

  //
  async getUserInfo(req: express.Request, res: express.Response) {
    const userId = req.params.id;

    try {
      const findUser = await User.findByPk(userId);
      console.log(findUser, userId);

      if (findUser) {
        res.json(await findUser);
      } else {
        res.status(400).json({
          message: "Користувач не знайдений",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Помилка отримання інформації про користувача",
      });
    }
  }

  // створення кода активації та відправка SMS
  async sendSMS(req: express.Request, res: express.Response) {
    const phone = req.query.phone;
    const userId = req.user.id;
    const smsCode = generateRandomCode();

    if (!phone) {
      return res.status(400).json({
        message: "Номер телефону не вказано",
      });
    }

    try {
      // await Axios.get(
      //     `https://api.turbosms.ua/message/send.json?recipients[0]=${phone}&sms[sender]=SOG&sms[text]=${smsCode}&token=${process.env.SMS_API_KEY}`
      // );

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
}

export default new AuthController();
