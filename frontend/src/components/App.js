import React, { useState, useEffect } from 'react';
import { Route, Switch, useHistory, withRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import CurrentUserContext from "../contexts/CurrentUserContext";
import { register, login, getData } from '../utils/auth';
import api from "../utils/api";

import '../index.css';
import Login from './Login';
import Register from './Register';
import InfoTooltip from './InfoTooltip';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import Error from "./Error";

function App() {
  // Хуки и стейты

  /**
   * Стейт для данных пользователя (имя, о себе, автарка, id)
   */
  const [currentUser, setCurrentUser] = useState({});

  /**
   * Стейт для авторизации. Показывает, залогинен пользователь или нет. Для показа только нужного контента
   */
  const [loggedIn, setLoggedIn] = useState(false);

  /**
   * Стейт для отображения InfoTooltip. Модалка при успешной/ неудачной регистрации или авторизации
   */
  const [isTooltipOpened, setIsTooltipOpened] = useState(false);

  /**
   * Стейт для авторизации. Состояние успешности авотризации пользователя.
   */
  const [isAuth, setIsAuth] = useState(false);

  /**
   * Стейт для карточек. Для отрисовки и работы с карточками, полученными с сервера
   */
  const [cards, setCards] = useState([]);

  /**
   * Стейты для отображения поп-апов (состояние - открыт / не открыт)
   */
  const [isEditAvatarPopupOpen, setIsAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);

  /**
   * Стейт для выбранной карточки. Используется в поп-апе картинки в полном размере.
   * Чтоб показать картинку нужной карточки при клике на фото
   */
  const [selectedCard, setSelectedCard] = useState(null);

  /**
   * Стейт для данных залогиненного пользователя. Содержит _id и email для отображения в приложении
   */
  const [userLoginData, setUserLoginData] = useState('');

  const history = useHistory();

  /**
   * Получение данных о пользователе и карточки
   * через API и запись их в стейты
   * Предварительно проверяем токен, чтобы отрисовать корректные логин и пароль
   */
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      return;
    }
    api.setToken(token)
    api.getInitialData()
      .then(([user, cards]) => {
        setCurrentUser(user);
        setCards(cards.cards.reverse());
      })
      .catch((err) => console.log(err));
  }, [loggedIn])

  // Обработчики

  /**
   * Обработчик клика по изображению карточки (открытие поп-апа картинки)
   * @param props - пропсы, принимаемые ф-ей в классе Card. Туда попадает сама карточка
   */
  function handleCardClick(props) {
    setSelectedCard(props);
    window.addEventListener('keydown', handleClosePopupWithEsc);
  }

  /**
   * Закрытие поп-апов клавишей Esc
   */
  function handleClosePopupWithEsc (event) {
    if (event.keyCode === 27) {
      closeAllPopups();
    }
  }

  /**
   * Показ/скрытие модалки об успешной/ неудачной регистрации
   */
  function openRegModal() {
    setIsTooltipOpened(!isTooltipOpened);
  }

  /**
   *  Закрытие модалки об успешной/ неудачной регистрации с помощью кнопки (крестик)
   */
  function closeRegModal() {
    setIsTooltipOpened(false);
    if (isAuth) {
      history.push('/sign-in')
    }
  }

  /**
   * Обработчик для отправки данных пользователя на сервер (редактирование данных профиля)
   * @param user — данные пользователя, содержит поля name, about, avatar, _id...
   */
  function handleUpdateUser(user) {
    api.editProfile(user.name, user.about)
      .then(res => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch(err => console.log(err))
  }

  /**
   * Обработчик для обновления аватарки пользователя (отправка на сервер через API)
   * @param user — данные пользователя, тут нам понадобится только поле avatar
   */
  function handleUpdateAvatar(user) {
    api.uploadAvatar(user.avatar)
      .then(res => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch(err => console.log(err))
  }

  /**
   * Обработчик кнопки редактирования аватарки
   */
  function handleEditAvatarClick() {
    setIsAvatarPopupOpen(true);
    window.addEventListener('keydown', handleClosePopupWithEsc);
  }

  /**
   * Обработчик кнопки редактирования информации профиля
   */
  function handleEditProfileClick() {
    setIsProfilePopupOpen(true);
    window.addEventListener('keydown', handleClosePopupWithEsc);
  }

  /**
   * Обработчик кнопки добавления новой карточки
   */
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
    window.addEventListener('keydown', handleClosePopupWithEsc);
  }

  /**
   * Обработчик закрытия любых поп-апов
   */
  function closeAllPopups() {
    setIsAddPlacePopupOpen(false);
    setIsAvatarPopupOpen(false);
    setIsProfilePopupOpen(false);
    setSelectedCard(null);
    window.removeEventListener('keydown', handleClosePopupWithEsc);
  }

  // Регистрация и авторизация пользователя

  /**
   * Регистрация нового пользователя
   * @param data - введенные человеком логин и пароль
   */
  const handleRegister = (data) => {
    const { email, password } = data;
    return register(email, password)
      .then((res) => {
        if (res) { //было res.data
          setIsAuth(true);
          setIsTooltipOpened(true);
          history.push('/sign-in');
        }
      })
      .catch((err) => {
        setIsAuth(false);
        openRegModal();
        console.log(`Произошла ошибка: ${err}`);
        history.push('/sign-up');
      });
  };

  /**
   * Авторизация пользователя
   * @param data - введенные человеком логин и пароль
   */
  const handleLogin = (data) => {
    const { email, password } = data;
    setUserLoginData(email);
    login(email, password)
      .then((res) => {
        if (res.token) {
          localStorage.setItem('jwt', res.token);
          setLoggedIn(true);
          setIsAuth(true);
          history.push('/');
        }
      })
      .catch((err) => {
        setIsAuth(false);
        setIsTooltipOpened(true);
        console.log(`Произошла ошибка: ${err}`);
      });
  };

  /**
   * Обновление стейтов пользователя на основе токена.
   * Если токен есть, устанавливаем loggedIn и userLoginData
   */
  useEffect(() => {
    if (localStorage.getItem('jwt')) {
      const jwt = localStorage.getItem('jwt');

      getData(jwt)
        .then((res) => {
          if(res) {
            setLoggedIn(true);
            setUserLoginData(res.email); // Тут было res.data.email
          }
        })
        .catch((err) => {
          setIsTooltipOpened(true);
          console.log(`Произошла ошибка: ${err}`);
        });
    }
  }, [history, loggedIn]);

  useEffect(() => {
    if (loggedIn) {
      history.push('/');
    }
  }, [history, loggedIn]);

  /**
   * Логаут пользователя из системы
   */
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    setIsAuth(false);
    history.push('/sign-in');
  };

  // Функциональности приложения

  /**
   * Функция лайка карточки
   * @param card - текущая карточка
   */
  function handleCardLike(card) {
    // Проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
      // Формируем новый массив на основе имеющегося, подставляя в него новую карточку
      const newCards = cards.map((item) => item._id === card._id ? newCard.data : item );
      // Обновляем стейт
      setCards(newCards);
    })
      .catch((err) => console.log(err));
  }

  /**
   * Функция удаления карточки, по аналогии с функцией лайка
   * @param card — удаляемая карточка
   */
  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards(cards.filter(item => item._id !== card._id));
      })
      .catch((err) => console.log(err));
  }

  /**
   * Функция добавления карточки
   * @param card — добавляемая карточка
   */
  function handleAddPlace(card) {
    api.addNewCard(card.name, card.link)
      .then(res => {
        setCards([res.body, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  /**
   * Отрисовка приложения
   */
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">

        <Switch>
          <ProtectedRoute
            exact path="/"
            loggedIn={loggedIn}
            component={Main}
            isEditAvatarPopupOpen={handleEditAvatarClick}
            isEditProfilePopupOpen={handleEditProfileClick}
            isAddPlacePopupOpen={handleAddPlaceClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            logout={handleLogout}
            userLoginData={userLoginData}
          />
          <Route path="/sign-in">
            <Login handleLogin={handleLogin} />
          </Route>
          <Route path="/sign-up">
            <Register handleRegister={handleRegister} />
          </Route>
          <Route path="*">
            <Error />
          </Route>
        </Switch>

        <Footer />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          onClick={(e) => e.stopPropagation()}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlace}
        />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <PopupWithForm
          onClose={closeAllPopups}
          name="confirm-delete"
          title="Вы уверены?"
          buttonName="Да"
        >
        </PopupWithForm>

        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
        />
        <InfoTooltip
          isOpen={isTooltipOpened}
          onClose={closeRegModal}
          isRegSuccess={isAuth}
          regSuccess="Вы успешно зарегестрировались!"
          regFailed="Что-то пошло не так! Попробуйте ещё раз."
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);
