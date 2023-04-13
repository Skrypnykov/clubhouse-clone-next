import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sharp from 'sharp';
import fs from 'fs';

import { uploader } from './core/uploader';
import { passport } from './core/passport';

dotenv.config({
  path: 'server/.env',
});

import './core/db';

const app = express();

app.use(cors());
app.use(passport.initialize());

app.get('/todos', (req, res) => {
  res.send('Hello')
})

app.post('/upload', uploader.single('photo'), (req, res) => {
  const filePath = req.file.path;
  sharp(filePath)
    .resize(150, 150)                                                         // змінюємо розмір файлу
    .toFormat('webp')
    .toFile(filePath.replace(/\.[^/.]+$/, '.webp'), (err) => {                // конвертує в webp
      if (err) {
        throw err;  
      }
      fs.unlinkSync(filePath);                                                // видаляє початковий файл
      res.json({
        url: `/avatars/${req.file.filename.replace(/\.[^/.]+$/, '.webp')}`,   // конвертує в webp на backend
      });
    });

});

app.get('/auth/github', passport.authenticate('github'));

app.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    session: false,
    failureRedirect: '/login',
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
  console.log('SERVER RUNNED!');
});
