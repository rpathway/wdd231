import { initCommon } from './common.mjs';
import { attractions } from '../data/attractions.mjs';

function displayVisitMessage() {
  const messageDiv = document.getElementById('visitMessage');
  if (!messageDiv) return;

  let message = '';
  const lastVisit = localStorage.getItem('lastVisit');
  const now = Date.now()

  if (!lastVisit) {
    message = "Welcome! Let us know if you have any questions.";
  } else {
    const daysSinceVisit = Math.floor((now - lastVisit) / (1000 * 60 * 60 * 24));

    if (daysSinceVisit < 1) {
      message = "Back so soon! Awesome!";
    } else if (daysSinceVisit === 1) {
      message = "You last visited 1 day ago. Ready for an adventure?";
    } else {
      message = `You last visited ${daysSinceVisit} days ago. Let's explore!`;
    }
  }

  messageDiv.textContent = message;
  messageDiv.classList.add('show');
  localStorage.setItem('lastVisit', now)

  setTimeout(() => {
    messageDiv.classList.add('fade-out');
  }, 5000);
}

function displayAttractions() {
  const grid = document.querySelector('.attractions-grid');
  if (!grid) return;

  grid.innerHTML = attractions.map(attraction => `
    <div class="attraction-card">
      <h2>${attraction.name}</h2>
      <figure>
        <img src="images/${attraction.image}" alt="Image of toronto attraction: ${attraction.name}" loading="lazy">
      </figure>
      <address>${attraction.address}</address>
      <p>${attraction.description}</p>
      <button class="learn-more-btn" aria-label="Learn more about attraction button">Learn More</button>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  initCommon();
  displayAttractions();
  displayVisitMessage();
});