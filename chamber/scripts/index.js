function initNavigation() {
  const menuButton = document.getElementById('menuButton');
  const navigation = document.querySelector('.navigation');

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      navigation.classList.toggle('open');

      if (navigation.classList.contains('open')) {
        menuButton.textContent = '✕';
      } else {
        menuButton.textContent = '☰';
      }
    });
  }
}

function initFooter() {
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  const modifiedElement = document.getElementById('lastModified');
  if (modifiedElement) {
    modifiedElement.textContent = document.lastModified;
  }
}

async function loadWeather() {
  const API_KEY = ''
  try {
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=43.6532&lon=-79.3832&units=metric&appid=${API_KEY}`;
    const currentResponse = await fetch(currentUrl);

    if (!currentResponse.ok) {
      throw new Error('Weather data not available');
    }

    const currentData = await currentResponse.json();
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=43.6532&lon=-79.3832&units=metric&appid=${API_KEY}`;
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    console.log(JSON.stringify(forecastData, null, 2));

    displayWeather(currentData, forecastData);

  } catch (error) {
    displayDefaultWeather();
  }
}

function displayWeather(current, forecast) {
  const getWeatherEmoji = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '🌨️',
    'Mist': '🌫️',
    'Fog': '🌫️',
    'Haze': '🌫️'    
  }
  const temp = Math.round(current.main.temp);
  const desc = current.weather[0].description;
  const icon = getWeatherEmoji?.[current.weather[0].main];
  const tempMax = Math.round(current.main.temp_max);
  const tempMin = Math.round(current.main.temp_min);
  const feelsLike = current.main.feels_like;
  const humidity  = current.main.humidity;
  const sunrise   = new Date(current.sys.sunrise * 1000).toLocaleTimeString([], { timeStyle: 'short' });
  const sunset    = new Date(current.sys.sunset * 1000).toLocaleTimeString([], { timeStyle: 'short' });

  document.getElementById('currentTemp').textContent = `${temp}°C`;
  document.getElementById('weatherDesc').textContent = desc.charAt(0).toUpperCase() + desc.slice(1);
  document.getElementById('weatherIcon').textContent = icon;
  const detailsHTML = `
    <p><strong>High:</strong> ${tempMax}°C</p>
    <p><strong>Low:</strong> ${tempMin}°C</p>
    <p><strong>Feels Like:</strong> ${feelsLike}°C</p>
    <p><strong>Sunrise:</strong> ${sunrise}</p>
    <p><strong>Sunset:</strong> ${sunset}</p>
    <p><strong>Humidity:</strong> ${humidity}%</p>
  `;

  document.getElementById('weatherDetails').innerHTML = detailsHTML;

  const forecastContainer = document.getElementById('forecastContainer');
  const dailyForecasts = getDailyForecasts(forecast.list);

  forecastContainer.innerHTML = dailyForecasts.slice(0, 7).map((day, index) => {
    const date = new Date(day.dt * 1000);
    const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
    const weatherEmoji = getWeatherEmoji?.[day.weather[0].main] || '☁️';

    return `
      <div class="forecast-day">
        <strong>${dayName}</strong>
        <div class="forecast-icon">${weatherEmoji}</div>
        <div class="forecast-temp">${Math.round(day.main.temp)}°C</div>
      </div>
    `;
  }).join('');
}

function getDailyForecasts(list) {
  const dailyData = [];
  const seenDates = new Set();

  list.forEach(item => {
    const timeOfData = item.dt * 1000
    const date = new Date(timeOfData).toDateString();

    if (!seenDates.has(date)) {
      seenDates.add(date);
      dailyData.push(item);
    }
  });

  return dailyData;
}

function displayDefaultWeather() {
  document.getElementById('currentTemp').textContent = '0°C';
  document.getElementById('weatherDesc').textContent = 'Mostly Cloudy';
  document.getElementById('weatherIcon').textContent = '☁️';

  document.getElementById('weatherDetails').innerHTML = `
    <p><strong>High:</strong> 0°C</p>
    <p><strong>Low:</strong> -2°C</p>
    <p><strong>Feels Like:</strong> -6°C</p>
    <p><strong>Sunrise:</strong> 06:07 AM</p>
    <p><strong>Sunset:</strong> 07:27 PM</p>
    <p><strong>Humidity:</strong> 12%</p>
  `;

  document.getElementById('forecastContainer').innerHTML = `
    <div class="forecast-day">
      <strong>Today</strong>
      <div class="forecast-icon">☁️</div>
      <div class="forecast-temp">0°C</div>
    </div>
    <div class="forecast-day">
      <strong>Sat</strong>
      <div class="forecast-icon">🌨️</div>
      <div class="forecast-temp">-1°C</div>
    </div>
    <div class="forecast-day">
      <strong>Sun</strong>
      <div class="forecast-icon">❄️</div>
      <div class="forecast-temp">-2°C</div>
    </div>
    <div class="forecast-day">
      <strong>Mon</strong>
      <div class="forecast-icon">🌧️</div>
      <div class="forecast-temp">2°C</div>
    </div>
    <div class="forecast-day">
      <strong>Tues</strong>
      <div class="forecast-icon">🌦️</div>
      <div class="forecast-temp">5°C</div>
    </div>
    <div class="forecast-day">
      <strong>Wed</strong>
      <div class="forecast-icon">☀️</div>
      <div class="forecast-temp">13°C</div>
    </div>
  `;
}

async function loadSpotlights() {
  try {
    const getRandomMembers = (arr, count) => {
      const shuffled = [...arr].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    }

    const response = await fetch('data/members.json');
    if (!response.ok) {
      throw new Error('Failed to load members');
    }

    const members = await response.json();
    const qualifiedMembers = members.filter(m => m.membershipLevel === 2 || m.membershipLevel === 3);
    const spotlightCount = Math.random() > 0.5 ? 3 : 2;
    const selectedMembers = getRandomMembers(qualifiedMembers, spotlightCount);
    
    displaySpotlights(selectedMembers);
    
  } catch (error) {
    document.getElementById('spotlightsContainer').innerHTML = '<p>Unable to load member spotlights.</p>';
  }
}

function displaySpotlights(members) {
  const container = document.getElementById('spotlightsContainer');
  const membershipInfo = {
    1: ['badge-member', 'Member'],
    2: ['badge-silver', 'Silver Member'],
    3: ['badge-gold', 'Gold Member']
  };

  container.innerHTML = members.map(member => {
    const [badgeClass, badgeText] = membershipInfo[member.membershipLevel];

    return `
      <div class="spotlight-card">
        <img src="images/${member.image}" alt="${member.name} logo">
        <h3>${member.name}</h3>
        <span class="membership-badge ${badgeClass}">${badgeText}</span>
        <p><strong>Phone:</strong> ${member.phone}</p>
        <p><strong>Address:</strong> ${member.address}</p>
        <p><strong>Website:</strong> <a href="${member.website}" target="_blank">${member.website.replace('https://', '')}</a></p>
      </div>
    `;
  }).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
  initFooter();
  initNavigation();
  await loadWeather();
  await loadSpotlights();
});