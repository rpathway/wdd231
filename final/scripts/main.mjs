import { fetchPokemonById } from "./api.js";
import { getLocationConditions } from "./location.js";
import { renderPokemonCard, renderModal } from "./ui.js";
import { saveCaughtPokemon, isCaught, getDailyEncounter, setDailyEncounter, isTrainerRegistered } from "./storage.js";



async function loadDailyEncounter() {
  const today = new Date();
  const pokemonCard = document.getElementById("pokemonCard");
  const encounterActions = document.getElementById("encounterActions");
  const encounterDate = document.getElementById("encounterDate");
  const encounterConditions = document.getElementById("encounterConditions");
  const encounterStatus = document.getElementById("encounterStatus");
  encounterDate.textContent = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  try {
    const conditions = await getLocationConditions();
    encounterConditions.textContent = `Conditions: ${conditions.description}`;
    let dailyEncounter = getDailyEncounter();

    if (!dailyEncounter || !isToday(dailyEncounter.date)) {
      const pokemonId = generateDailyPokemonId(conditions);
      const isShiny = Math.random() < 0.05; 
      const pokemon = await fetchPokemonById(pokemonId);

      dailyEncounter = {
        date: today.toISOString(),
        pokemon: pokemon,
        isShiny: isShiny,
        conditions: conditions.description,
      };

      setDailyEncounter(dailyEncounter);
    }

    pokemonCard.innerHTML = renderPokemonCard(
      dailyEncounter.pokemon,
      dailyEncounter.isShiny,
    );

    encounterActions.style.display = "flex";
    if (isCaught(dailyEncounter.pokemon.id, dailyEncounter.isShiny)) {
      encounterStatus.textContent = "✓ Already caught today!";
      encounterStatus.className = "encounter-status success";
      encounterStatus.style.display = "block";

      const catchBtn = document.getElementById("catchBtn");
      catchBtn.disabled = true;
      catchBtn.style.opacity = "0.5";
      catchBtn.style.cursor = "not-allowed";
    }

  } catch (error) {
    console.error("Error loading daily encounter:", error);
    pokemonCard.innerHTML = `
      <div>
        <p>⚠️ Failed to load today's encounter</p>
        <p>Please try refreshing the page</p>
      </div>
    `;
  }
}

function generateDailyPokemonId(conditions) {
  const today = new Date();
  const seed = today.getFullYear() + today.getMonth() + today.getDate() + conditions.seed;
  const seededRandom = () => {
    const  x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  return Math.floor(seededRandom() * 151) + 1;
}

function isToday(dateString) {
  const date = new Date(dateString);
  const today = new Date();

  return (
    date.getDate()     == today.getDate()  &&
    date.getMonth()    == today.getMonth() &&
    date.getFullYear() == today.getFullYear()
  );
}

function setupEventListeners() {
  const catchBtn = document.getElementById("catchBtn");
  const infoBtn = document.getElementById("infoBtn");
  const modal = document.getElementById("pokemonModal");
  const modalClose = modal?.querySelector(".modal-close");

  if (catchBtn) {
    catchBtn.addEventListener("click", handleCatch);
  }

  if (infoBtn) {
    infoBtn.addEventListener("click", () => {
      const dailyEncounter = getDailyEncounter();

      if (dailyEncounter && modal) {
        const modalBody = document.getElementById("modalBody");

        modalBody.innerHTML = renderModal(
          dailyEncounter.pokemon,
          dailyEncounter.isShiny,
        );

        modal.showModal();
      }
    });
  }

  if (modalClose && modal) {
    modalClose.addEventListener("click", () => {
      modal.close();
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.close();
      }
    });
  }
}


function handleCatch() {
  const encounterStatus = document.getElementById("encounterStatus");
  const dailyEncounter = getDailyEncounter();

  if (!dailyEncounter) {
    encounterStatus.textContent = "⚠️ No encounter available";
    encounterStatus.className = "encounter-status info";
    encounterStatus.style.display = "block";

    return;
  }

  if (!isTrainerRegistered()) {
    encounterStatus.textContent = "⚠️ Please register as a trainer first to save your catches!";
    encounterStatus.className = "encounter-status info";
    encounterStatus.style.display = "block";

    return;
  }

  saveCaughtPokemon(dailyEncounter.pokemon.id, dailyEncounter.isShiny);
  encounterStatus.textContent = `✓ Successfully caught ${dailyEncounter.pokemon.name}${dailyEncounter.isShiny ? " (Shiny)" : ""}!`;
  encounterStatus.className = "encounter-status success";
  encounterStatus.style.display = "block";

  const catchBtn = document.getElementById("catchBtn");
  catchBtn.disabled = true;
  catchBtn.style.opacity = "0.5";
  catchBtn.style.cursor = "not-allowed";
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

document.addEventListener("DOMContentLoaded", async () => {
  initNavigation();
  // await loadDailyEncounter();
  // setupEventListeners();
});