function displayTrainerForm() {
  const params = new URLSearchParams(window.location.search);
  const trainerName = params.get('trainerName') || 'Trainer';
  const email = params.get('email') || 'Not provided';
  
  document.getElementById('displayName').textContent = trainerName;
  document.getElementById('displayEmail').textContent = email;
  document.getElementById('displayDate').textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function initNavigation() {
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector("nav");

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle('open');
      nav.classList.toggle("active");

      if (hamburger.classList.contains('open')) {
        hamburger.textContent = '✕';
      } else {
        hamburger.textContent = '☰'
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  displayTrainerForm();
})