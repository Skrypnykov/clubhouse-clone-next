# Встановлення

1. `npm install` or `yarn install` - встановлюємо всі залежності.
2. Для створення налаштувань програми, необхідно скопіювати файл .env.example і зберегти як .env в папці server.
3. Вказати `GITHUB_CLIENT_ID` та `GITHUB_CLIENT_SECRET`, які можна витягнути зі створеного OAuth-додатка на GitHub'і.

# Запуск

Необхідно запустити сервер та NextJS. Перед запуском зробіть `npm run migrate` or `yarn migrate` і далі:

1. `npm run server` or `yarn server` - запускає Express-сервер
2. `npm run dev` or `yarn dev` - запускає NextJS-додаток
