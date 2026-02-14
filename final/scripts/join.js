import { saveTrainer, isTrainerRegistered } from './storage.js';



function showMessage(message, type) {
  const formMessage = document.getElementById('formMessage');
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  formMessage.style.display = 'block';

  formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function handleFormSubmit(e) {
  const formMessage = document.getElementById('formMessage');
  const trainerName = document.getElementById('trainerName').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const termsAccepted = document.getElementById('terms').checked;

  formMessage.style.display = 'none';
  formMessage.className = 'form-message';
  const checkFields = {
    "allFields": {
      value: !trainerName || !email || !password || !confirmPassword,
      msg: 'Please fill in all fields'
    },
    "validName": {
      value: trainerName.length < 3 || trainerName.length > 20,
      msg: 'Trainer name must be between 3 and 20 characters'
    },
    "validEmail": {
      value: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      msg: 'Please enter a valid email address'
    },
    "validPassword": {
      value: password.length < 6,
      msg: 'Password must be at least 6 characters long'
    },
    "passwordsMatch": {
      value: password !== confirmPassword,
      msg: 'Passwords do not match'
    },
    "acceptedTerms": {
      value: !termsAccepted,
      msg: 'Please accept the terms and conditions'
    }
  }

  const found = Object.values(checkFields).find(field => field.value === true) || null;
  if (found !== null) {
    e.preventDefault();
    showMessage(found.msg, 'error');
    return false;
  }

  const trainerData = {
    name: trainerName,
    email: email,
    registeredAt: new Date().toISOString()
  };

  saveTrainer(trainerData);

  return true;
}

function setupForm() {
  const form = document.getElementById('registrationForm');

  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
}

function checkExistingRegistration() {
  if (isTrainerRegistered()) {
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = "✓ You're already registered as a trainer!";
    formMessage.className = 'form-message success';
    formMessage.style.display = 'block';
  }
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
  checkExistingRegistration();
  setupForm();
});