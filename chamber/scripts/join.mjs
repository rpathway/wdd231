import { initCommon  } from "./common.mjs";

function initModals() {
  const learnMoreButtons = document.querySelectorAll('.learn-more');
  const closeButtons = document.querySelectorAll('.close-modal');

  learnMoreButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modalId = button.getAttribute('data-modal');
      const modal = document.getElementById(modalId);

      if (modal) {
        modal.showModal();
      }
    });
  });

  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Parent
      const modal = button.closest('.modal');

      if (modal) {
        modal.close();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initCommon();
  initModals();
})