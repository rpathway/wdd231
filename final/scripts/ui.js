function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function renderPokemonCard(pokemon, isShiny = false) {
  const imageUrl = isShiny ? pokemon.spriteShiny : pokemon.sprite;
  const shinyClass = isShiny ? 'shiny' : '';

  return `
    <div class="pokemon-display ${shinyClass}">
      <img src="${imageUrl}" alt="${pokemon.name}" loading="lazy" >
      ${isShiny ? '<span class="shiny-badge">✨ Shiny</span>' : ''}
      <h3 class="pokemon-name">${capitalize(pokemon.name)}</h3>
      <p class="pokemon-id">#${String(pokemon.id).padStart(3, '0')}</p>
      <div class="pokemon-types">
        ${pokemon.types.map(type => `<span class="type-badge type-${type}">${type}</span>`).join('')}
      </div>
    </div>
  `;
}

export function renderModal(pokemon, isShiny = false) {
  const imageUrl = isShiny ? pokemon.spriteShiny : pokemon.sprite;
  const statNames = {
    'hp': 'HP',
    'attack': 'Attack',
    'defense': 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    'speed': 'Speed'
  };
  // Round to nearest and fill stat bar
  const createStatBar = (value) => {
    const valueToPercent = Math.round((value / 255) * 100);
    return '█'.repeat(Math.floor(valueToPercent / 5));
  }
  const formatAbilityName = (ability) => {
    return ability.split('-').map(word => capitalize(word)).join(' ');
  }

  return `
    <div class="modal-pokemon-detail">
      <div class="modal-header">
        <h2>${capitalize(pokemon.name)}</h2>
        <p class="modal-id">#${String(pokemon.id).padStart(3, '0')}</p>
        ${isShiny ? '<span class="shiny-badge">✨ Shiny</span>' : ''}
      </div>
      <div class="modal-image">
        <img src="${imageUrl}" alt="${pokemon.name}">
      </div>
      <div class="modal-types">
        ${pokemon.types.map(type => `<span class="type-badge type-${type}">${type}</span>`).join('')}
      </div>
      <div class="modal-info">
        <div class="info-row">
          <span class="info-label">Height:</span>
          <span class="info-value">${pokemon.height / 10} m</span>
        </div>
        <div class="info-row">
          <span class="info-label">Weight:</span>
          <span class="info-value">${pokemon.weight / 10} kg</span>
        </div>
      </div>
      <div class="modal-abilities">
        <h4>Abilities</h4>
        <div class="abilities-list">
          ${pokemon.abilities.map(ability => `<span class="ability-badge">${formatAbilityName(ability)}</span>`).join('')}
        </div>
      </div>
      <div class="modal-stats">
        <h4>Base Stats</h4>
        ${pokemon.stats.map(stat => `
          <div class="stat-row">
            <span class="stat-name">${statNames[stat.name] || capitalize(stat.name)}</span>
            <div class="stat-bar-container">
              <div>${createStatBar(stat.value)}</div>
            </div>
            <span class="stat-value">${stat.value}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function renderGridCard(pokemon, isCaught = false, hasShiny = false) {
  const imageUrl = pokemon.sprite;
  const cardClass = isCaught ? 'caught' : 'uncaught';

  return `
    <div class="pokemon-grid-card ${cardClass}" data-id="${pokemon.id}">
      <div class="card-image">
        <img src="${imageUrl}" alt="${pokemon.name}" loading="lazy">
        ${hasShiny ? '<span class="shiny-indicator">✨</span>' : ''}
      </div>
      <div class="card-info">
        <p class="card-id">#${String(pokemon.id).padStart(3, '0')}</p>
        <h4 class="card-name">${capitalize(pokemon.name)}</h4>
        <div class="card-types">
          ${pokemon.types.map(type => `<span class="type-badge type-${type}">${type}</span>`).join('')}
        </div>
      </div>
      ${!isCaught ? '<div class="card-overlay"><span>?</span></div>' : ''}
    </div>
  `;
}