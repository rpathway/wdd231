function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getConditionsFromCoordinates(lat, lon) {
  const hour = new Date().getHours();
  const month = new Date().getMonth();
  const isNorth = lat > 0;

  const seasons = ['winter', 'spring', 'summer', 'fall'];
  // 3 months per season
  const seasonIndex = Math.floor((month % 12) / 3);
  // Offset southern hemisphere (2 seasons)
  const season = seasons[isNorth ? seasonIndex : (seasonIndex + 2) % 4];

  const times = ['night', 'morning', 'afternoon', 'evening', 'night'];
  // 5 hour blocks
  const timeIndex = Math.floor((hour + 1) / 5);
  const timeOfDay = times[Math.min(timeIndex, 4)];

  const climates = ['tropical', 'temperate', 'cool', 'polar'];
  const absLat = Math.abs(lat);
  // < 23.5 - Cancer/Capricorn tropic
  // < 40   - Subtropical
  // < 60   - Temprate/Subarctic
  // 3      - Arctic (there's always that one guy)
  const climate = climates[absLat < 23.5 ? 0 : absLat < 40 ? 1 : absLat < 60 ? 2 : 3];

  return {
    description: `${capitalize(season)} ${timeOfDay} in ${climate} region`,
    season,
    timeOfDay,
    climate,
    seed: Math.floor(lat * 100) + Math.floor(lon * 100)
  };
}

function getTimeBasedConditions() {
  const now = new Date();
  const hour = now.getHours();
  const month = now.getMonth();

  const times = ['night', 'morning', 'afternoon', 'evening', 'night'];
  // 0-23 hours to 5 hour blocks cap at 4
  const timeOfDay = times[Math.min(Math.floor((hour + 1) / 5), 4)];

  const seasons = ['winter', 'spring', 'summer', 'fall'];
  // 0-11 months to 4 seasons (3 months per)
  const season = seasons[Math.floor((month % 12) / 3)];

  return {
    description: `${capitalize(season)} ${timeOfDay}`,
    season,
    timeOfDay,
    climate: 'unknown',
    seed: hour + month * 100
  };
}

export function getEncounterRarity(conditions) {
  if (conditions.timeOfDay == 'night')   return 'rare';
  if (conditions.timeOfDay == 'morning') return 'common';

  return 'normal';
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      error    => reject(error),
      { timeout: 5000 }
    );
  });
}

export async function getLocationConditions() {
  try {
    const position = await getCurrentPosition();
    if (position) {
      return getConditionsFromCoordinates(position.coords.latitude, position.coords.longitude);
    }

  } catch (error) {
    console.log('Geolocation not available, using default conditions');
  }

  return getTimeBasedConditions();
}