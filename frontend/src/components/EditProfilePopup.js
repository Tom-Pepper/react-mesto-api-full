import React, { useState, useContext, useEffect } from 'react';
import PopupWithForm from "./PopupWithForm";
import CurrentUserContext from "../contexts/CurrentUserContext";

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  //Подписываемся на контекст
  const currentUser = useContext(CurrentUserContext);

  //Cтейты имени и описания профиля
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  //После загрузки данных пользователя из API, эти данные будут использоваться в управляемых компонентах (полях)
  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser])

  //Функция для изменения имени через поле ввода
  function handleUserName(event) {
    setName(event.target.value)
  }

  //Функция для изменения описания профиля через поле ввода
  function handleUserDescription(event) {
    setDescription(event.target.value)
  }

  //Обработчик сабмита формы
  function handleSubmit(event) {
    event.preventDefault();

    //Передача значений управляемых компонентов во внешний обработчик
    onUpdateUser({
      name: name,
      about: description
    });
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      name="edit-profile"
      title="Редактировать профиль"
      buttonName="Сохранить"
      onSubmit={handleSubmit}
    >
      <input
        required
        name="profile-name"
        type="text"
        className="popup__name popup__input"
        placeholder="Имя"
        onChange={handleUserName}
        minLength="2"
        maxLength="40"
        value={name ? name : ''}
      />
      <span
        id="profile-name-error"
        className="error">
          </span>
      <input
        required
        name="profile-job"
        type="text"
        className="popup__job popup__input"
        placeholder="О себе"
        onChange={handleUserDescription}
        minLength="2"
        maxLength="200"
        value={description ? description : ''}
      />
      <span
        id="profile-job-error"
        className="error">
          </span>

    </PopupWithForm>
  )
}

export default EditProfilePopup;
