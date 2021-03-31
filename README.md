# Проект "Место". Фронтенд и бэкенд

Проект для создания карточек интересных мест `но по факту там будут котики (:`
Пользователи могут добавлять, смотреть карточки, ставить лайки.

### [Потыкать проект в браузере](https://pepper.nomoredomains.icu) 
Если ссылка не работает, то скорее всего кончился пробный грант в Я.Облаке. Тогда читайте ниже :)

---
### Функционал:
- Простая регистрация (без подтверждения по email или телефону) и авторизация
- Пользователь может менять имя, поле "обо мне", аватарку. Все сохраняется на сервере
- Пользователь может ставить и убирать лайки всем карточкам
- Пользователь может удалять карточки. Но только те, что создал сам
- Пользователь может добавлять новые карточки

### Технологии:

- HTML5, CSS, адаптивная кроссбраузерная вертска
- ReactJS, JavaScript
- HTTP- сервер Nginx
- MongoDB
- Бэк Node.js
---

### Запуск приложения локально

- Необходимо локально установить [MongoBD](https://www.mongodb.com/), и проверить, что в файле `/backend/app.js` в строке
  22 указан такой же порт, как у вас локально. Имя базы может быть любым. Она создастся автоматически при первой записи
- Скачайте проект локально.
- В файле `/backend/app.js` раскомментируйте строку 18 и **закомментируйте** строку 16
- Находясь в папке `/backend/` выполните `npm install`, а потом `npm run start`
- Вы получите сообщение, что проект запущен на порте 3001, а так же подключены к БД (в консоли `Mesto is connected to DB`)

- *Описание в разработке*

 
