const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';



function formatPokemonData(data) {
  return {
    id: data.id,
    name: data.name,
    types: data.types.map(t => t.type.name),
    sprite: data.sprites.front_default,
    spriteShiny: data.sprites.front_shiny,
    height: data.height,
    weight: data.weight,
    abilities: data.abilities.map(a => a.ability.name),
    stats: data.stats.map(s => ({
      name: s.stat.name,
      value: s.base_stat
    }))
  };
}

export async function fetchPokemonById(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return formatPokemonData(data);
  } catch (error) {
    console.error(`Error fetching Pokemon ${id}:`, error);
    throw error;
  }
}

export async function fetchPokemon() {
  const getIdFromUrl = (url) => {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 2]);
  }

  try {
    const response = await fetch(`${BASE_URL}?limit=151&offset=0`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const pokemonPromises = data.results.map(pokemon => {
      const id = getIdFromUrl(pokemon.url);

      return fetchPokemonById(id);
    });

    return await Promise.all(pokemonPromises);
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    throw error;
  }
}

export async function fetchPokemonByName(name) {
  try {
    const response = await fetch(`${BASE_URL}/${name.toLowerCase()}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return formatPokemonData(data);
  } catch (error) {
    console.error(`Error fetching Pokemon ${name}:`, error);
    throw error;
  }
}
