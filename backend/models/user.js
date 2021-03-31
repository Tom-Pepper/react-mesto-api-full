/**
 * Схема добавления карточки в БД
 * @type {module:mongoose}
 * Описываем поля пользователя и их валидацию
 */
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const { default: validator } = require('validator');
const AuthError = require('../errors/authError');

const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]+\.[a-zA-Z0-9()]+([-a-zA-Z0-9()@:%_\\+.~#?&/=#]*)/;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Tim Berners-Lee',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Scientist, Inventor',
  },
  avatar: {
    required: false,
    type: String,
    validate: {
      validator(v) {
        return regex.test(v);
      },
      message: 'Введите корректный URL изображения',
    },
    default: 'https://media.wired.com/photos/5c86f3dd67bf5c2d3c382474/4:3/w_2400,h_1800,c_limit/TBL-RTX6HE9J-(1).jpg',
  },
  email: {
    required: true,
    type: String,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
    },
    unique: true,
  },
  password: {
    required: true,
    type: String,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthError('Не корректный пароль или email'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthError('Не корректный пароль или email'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
