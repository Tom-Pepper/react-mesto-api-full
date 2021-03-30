import React, { useState, useEffect } from 'react';
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
  //Стейты для имени и ссылки на картинку
  const [cardTitle, setCardTitle] = useState('');
  const [cardLink, setCardLink] = useState('');

  //Обработчик установки названия места
  function handleCardTitle(event) {
    setCardTitle(event.target.value)
  }

  //Обработчик установки картинки (ссылки на картинку)
  function handleCardLink(event) {
    setCardLink(event.target.value)
  }

  //Обработчик сабмита формы поп-апа добавления карточки
  function handleSubmit(event) {
    event.preventDefault();

    onAddPlace({
      name: cardTitle,
      link: cardLink
    })
  }

  useEffect(() => {
    setCardLink('')
    setCardTitle('')
  }, [isOpen])

  return(
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      title="Новое место"
      name="add-place"
      buttonName="Создать"
      onSubmit={handleSubmit}
    >
      <input
        required
        name="place-name"
        type="text"
        className="popup-new-place__description popup__input popup__name"
        placeholder="Название"
        minLength="2"
        maxLength="30"
        onChange={handleCardTitle}
        value={cardTitle ? cardTitle : ''}
      />
      <span
        id="place-name-error"
        className="error">
          </span>
      <input
        required
        name="place-link"
        type="url"
        className="popup-new-place__image-link popup__input popup__job"
        placeholder="Ссылка на картинку"
        onChange={handleCardLink}
        value={cardLink ? cardLink : ''}
      />
      <span
        id="place-link-error"
        className="error">
          </span>
    </PopupWithForm>
  )
}

export default AddPlacePopup;
