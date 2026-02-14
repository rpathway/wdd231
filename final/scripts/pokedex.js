import { fetchPokemon } from "./api.js";
import { getCaughtPokemon, getCaughtCount, getShinyCount } from "./storage.js";
import { renderGridCard, renderModal } from "./ui.js";



function showPokemonDetails(pokemon, hasShiny) {
  const modal = document.getElementById("pokemonModal");
  const modalBody = document.getElementById("modalBody");
  
  if (modal && modalBody) {
    modalBody.innerHTML = renderModal(pokemon, hasShiny);
    modal.showModal();
  }
}

function setupModal() {
  const modal = document.getElementById("pokemonModal");
  const modalClose = modal?.querySelector(".modal-close");

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

async function loadPokedex() {
  const pokemonGrid = document.getElementById("pokemonGrid");
  const caughtCountEl = document.getElementById("caughtCount");
  const shinyCountEl = document.getElementById("shinyCount");

  try {
    const allPokemon = await fetchPokemon();
    const caughtPokemon = getCaughtPokemon();
    caughtCountEl.textContent = getCaughtCount();
    shinyCountEl.textContent = getShinyCount();

    pokemonGrid.innerHTML = "";
    allPokemon.forEach((pokemon) => {
      const isCaught = caughtPokemon.some(p => p.id === pokemon.id);
      const hasShiny = caughtPokemon.some(p => p.id === pokemon.id && p.isShiny);
      const card = document.createElement("div");
      card.innerHTML = renderGridCard(pokemon, isCaught, hasShiny);

      if (isCaught) {
        card.querySelector(".pokemon-grid-card").addEventListener("click", () => {
          showPokemonDetails(pokemon, hasShiny);
        });
      }

      pokemonGrid.appendChild(card.firstElementChild);
    });
  } catch (error) {
    console.error("Error loading Pokédex:", error);
    pokemonGrid.innerHTML = `
      <div class="error-state">
        <p>⚠️ Failed to load Pokédex</p>
        <p>Please try refreshing the page</p>
      </div>
    `;
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

document.addEventListener("DOMContentLoaded", async () => {
  initNavigation();
  await loadPokedex();
  setupModal();
});