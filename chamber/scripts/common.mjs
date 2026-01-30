export function initFooter() {
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  const modifiedElement = document.getElementById('lastModified');
  if (modifiedElement) {
    modifiedElement.textContent = document.lastModified;
  }
}

export function initNavigation() {
  const menuButton = document.getElementById('menuButton');
  const navigation = document.querySelector('.navigation');

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      navigation.classList.toggle('open');

      if (navigation.classList.contains('open')) {
        menuButton.textContent = '✕';
      } else {
        menuButton.textContent = '☰';
      }
    });
  }
}

export function setTimestamp() {
  const timestampField = document.getElementById('timestamp');
  if (timestampField) {
    const now = new Date();
    timestampField.value = now.toISOString();
  }
}

export function initCommon() {
  initFooter();
  initNavigation();
  setTimestamp();
}