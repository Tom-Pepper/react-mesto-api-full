//Функция для отображения состояния загрузки (UX, лоадер)
export function buttonLoader(isLoading, popup, loadingText, originalText) {
  const button = popup.querySelector('.popup__button');
  if(isLoading) {
    button.textContent = loadingText;
  } else {
    button.textContent = originalText;
  }
}
