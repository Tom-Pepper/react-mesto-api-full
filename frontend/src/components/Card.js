import React, { useContext } from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  //Подписка на контекст CurrentUserContext
  const currentUser = useContext(CurrentUserContext);

  //Определяем, являемся ли мы владельцем карточки
  const isOwn = card.owner === currentUser._id;

  //Переменная для класса кнопки удаления (если карточка наша -- видим иконку удаления)
  const cardDeleteButtonClassName = (
    `element__delete-button ${isOwn ? 'element__delete-button_visible' : ''}`
  );

  //Определяем, есть ли у карточки поставленный нами лайк
  const isLiked = card.likes.some(i => i === currentUser._id);

  //Переменная для класса кнопки лайка (закрашивание, если карточка лайкнута нами)
  const cardLikeButtonClassName = (
    `element__like-button ${isLiked ? 'element__like-button_active' : ''}`
  );

  //Обработчик клика по карточке
  function handleCardClick() {
    onCardClick(card)
  }

  //Обработчик клика по лайку
  function handleCardLike() {
    onCardLike(card)
  }

  //Обработчик удаления карточки
  function handleDeleteCard() {
    onCardDelete(card)
  }

  return (
    <figure className="element">
      <img className="element__image" src={card.link} alt={card.name} onClick={handleCardClick} />
      <button type="button" className={cardDeleteButtonClassName} onClick={handleDeleteCard} />
      <figcaption className="element__caption">
        <h2 className="element__title">{card.name}</h2>
        <div className="element__like-wrapper">
          <button type="button" className={cardLikeButtonClassName} onClick={handleCardLike} />
          <p className="element__like-counter">{card.likes.length}</p>
        </div>
      </figcaption>
    </figure>
  )
}

export default Card;
