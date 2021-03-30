import React, { useRef, useEffect } from 'react';
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
  //Реф для прямого доступа к DOM-элементу инпута и его значению
  const avatarRef = useRef('');

  //Очистка поля ввода ссылки после закрытия
  useEffect(() => {
    avatarRef.current.value = '';
  }, [isOpen])

  //Обработчик сабмита формы (обновление аватарки)
  function handleSubmit(event) {
    event.preventDefault();

    onUpdateAvatar({
      avatar: avatarRef.current.value
    });
  }

  return(
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      title="Обновить аватар"
      name="edit-avatar"
      buttonName="Сохранить"
      onSubmit={handleSubmit}
    >
      <input
        className="popup__name popup__input"
        type="url"
        name="avatar"
        required
        placeholder="Ссылка на фотографию"
        ref={avatarRef}
      />
      <span
        id="avatar-error"
        className="error"
      >
      </span>
    </PopupWithForm>
  )
}

export default EditAvatarPopup;
