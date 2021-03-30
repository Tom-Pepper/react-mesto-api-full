import React from 'react';

function ImagePopup({ card, onClose }) {
  return (
    <div className={`popup-image popup ${card && "popup_is-opened"}`}>
      <div className="popup-image__container">
        <button className="popup__close popup-image__close" onClick={onClose} />
        <div className="popup-image__content-container">
          <figure className="popup-image__photo">
            <img src={card ? card.link : ""} alt={card ? card.name : ""} className="popup-image__preview" />
            <figcaption className="popup-image__title">{card ? card.name : ""}</figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}

export default ImagePopup;
