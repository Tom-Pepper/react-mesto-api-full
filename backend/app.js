require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const { apiLogger, errLogger } = require('./middlewares/logger');

const usersRoutes = require('./routes/users.js');
const cardsRoutes = require('./routes/cards.js');

const { loginUser, createUser } = require('./controllers/usersController');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
// Порт для теста локально
// const PORT = 3001;
const app = express();

// Подключаем БД
mongoose.connect('mongodb://localhost:27017/mestodatabase', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
  .then(() => console.log('Mesto is connected to DB'));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(apiLogger);

// Код для краш-теста (сервер должен подняться после падения сам, исп. pm2)
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// Подключение роутов и обработка несуществующих роутов
app.post('/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  loginUser);

app.post('/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser);

app.use('/', auth, usersRoutes);
app.use('/', auth, cardsRoutes);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

app.use(errLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { message } = err;
  const statusCode = err.statusCode || 500;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'Произошла ошибка на сервере'
      : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`Mesto is listening on port ${PORT}`);
});
