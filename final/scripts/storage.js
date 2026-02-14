const STORAGE_KEYS = {
  TRAINER: 'kantodex_trainer',
  CAUGHT_POKEMON: 'kantodex_caught',
  DAILY_ENCOUNTER: 'kantodex_daily_encounter'
};

export function saveTrainer(trainerData) {
  try {
    localStorage.setItem(STORAGE_KEYS.TRAINER, JSON.stringify({
      ...trainerData,
      registeredAt: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error saving trainer data:', error);
  }
}

export function getTrainer() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRAINER);

    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting trainer data:', error);
    return null;
  }
}

export function isTrainerRegistered() {
  return getTrainer() !== null;
}

export function saveCaughtPokemon(pokemonId, isShiny = false) {
  try {
    const caught = getCaughtPokemon();
    const entry = {
      id: pokemonId,
      isShiny: isShiny,
      caughtAt: new Date().toISOString()
    };

    // Check if already caught
    const exists = caught.some(p => p.id === pokemonId && p.isShiny === isShiny);
    if (!exists) {
      caught.push(entry);
      localStorage.setItem(STORAGE_KEYS.CAUGHT_POKEMON, JSON.stringify(caught));
    }
  } catch (error) {
    console.error('Error saving caught Pokemon:', error);
  }
}

export function getCaughtPokemon() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CAUGHT_POKEMON);

    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting caught Pokemon:', error);
    return [];
  }
}

export function isCaught(pokemonId, isShiny = false) {
  const caught = getCaughtPokemon();
  return caught.some(p => p.id === pokemonId && p.isShiny === isShiny);
}

export function getCaughtCount() {
  const caught = getCaughtPokemon();
  // Count unique IDs (regardless if shiny)
  const uniqueIds = new Set(caught.map(p => p.id));

  return uniqueIds.size;
}

export function getShinyCount() {
  const caught = getCaughtPokemon();
  return caught.filter(p => p.isShiny).length;
}

export function setDailyEncounter(encounterData) {
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY_ENCOUNTER, JSON.stringify(encounterData));
  } catch (error) {
    console.error('Error setting daily encounter:', error);
  }
}

export function getDailyEncounter() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DAILY_ENCOUNTER);

    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting daily encounter:', error);
    return null;
  }
}