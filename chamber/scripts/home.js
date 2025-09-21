// scripts/home.js
document.addEventListener('DOMContentLoaded', () => {
  const membersUrl = 'data/members.json';
  const spotlightEl = document.getElementById('spotlight-list');
  const forecastListEl = document.getElementById('forecast-list');
  const currentTempEl = document.getElementById('current-temp');
  const currentDescEl = document.getElementById('current-desc');
  const weatherIconEl = document.getElementById('weather-icon');
  const yearEl = document.getElementById('currentyear');
  const lastEl = document.getElementById('lastModified');

  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (lastEl) lastEl.textContent = document.lastModified || 'Not available';

  /* ---------- WEATHER SETTINGS ----------
     Replace the API key below with your OpenWeatherMap API key.
     Set LAT/LON for your chamber location if you want a different location.
  */
  const OPENWEATHER_API_KEY = '96dd8607d22b7d21d2a2f28da81a68be'; // <<--- replace this
  const LAT = 6.45;  // example: Lagos latitude (change as desired)
  const LON = 3.40;  // example: Lagos longitude (change as desired)

  const weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${LAT}&lon=${LON}&exclude=minutely,hourly,alerts&units=metric&appid=${OPENWEATHER_API_KEY}`;

  async function loadWeather() {
    try {
      const res = await fetch(weatherUrl);
      if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);
      const data = await res.json();

      const temp = Math.round(data.current.temp);
      const desc = data.current.weather[0].description;
      const icon = data.current.weather[0].icon;

      currentTempEl.textContent = temp;
      currentDescEl.textContent = desc;
      weatherIconEl.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
      weatherIconEl.alt = desc;
      weatherIconEl.style.display = '';

      // 3-day forecast (next 3 days)
      forecastListEl.innerHTML = '';
      const days = data.daily.slice(1, 4);
      days.forEach(d => {
        const dateText = new Date(d.dt * 1000).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
        const dayTemp = `${Math.round(d.temp.day)}°C`;
        const dayDesc = d.weather[0].description;
        const dayIcon = d.weather[0].icon;
        const li = document.createElement('li');
        li.innerHTML = `<strong>${dateText}</strong> — ${dayTemp} — ${dayDesc} <img src="https://openweathermap.org/img/wn/${dayIcon}.png" alt="${dayDesc}" width="28" height="28" style="vertical-align:middle;margin-left:.35rem">`;
        forecastListEl.appendChild(li);
      });

    } catch (err) {
      console.error(err);
      currentTempEl.textContent = '--';
      currentDescEl.textContent = 'Unavailable';
      forecastListEl.innerHTML = '<li>Forecast unavailable</li>';
    }
  }

  /* ---------- SPOTLIGHTS: random 2-3 gold/silver members ---------- */
  async function loadSpotlights() {
    try {
      const res = await fetch(membersUrl);
      if (!res.ok) throw new Error(`Members fetch failed: ${res.status}`);
      const members = await res.json();

      // filter gold (3) and silver (2)
      const candidates = members.filter(m => Number(m.level) >= 2);
      if (!candidates.length) {
        spotlightEl.innerHTML = '<p>No silver/gold members found.</p>';
        return;
      }

      // shuffle (Fisher-Yates) and pick 2 or 3
      for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
      }
      const pickCount = Math.min(candidates.length, Math.random() < 0.35 ? 3 : 2);
      const chosen = candidates.slice(0, pickCount);

      spotlightEl.innerHTML = '';
      chosen.forEach(m => {
        const div = document.createElement('div');
        div.className = 'spotlight';
        div.innerHTML = `
          <img src="images/${m.image}" alt="${m.name} logo" width="72" height="72" loading="lazy">
          <div class="spot-body">
            <h3 class="spot-name"><a href="${m.website}" target="_blank" rel="noopener">${m.name}</a></h3>
            <p class="small member-meta">${m.address}</p>
            <p class="small">Phone: <a href="tel:${m.phone.replace(/\D/g,'')}">${m.phone}</a></p>
            <p class="small"><strong>${m.level === 3 ? 'Gold' : 'Silver'} Member</strong></p>
          </div>
        `;
        spotlightEl.appendChild(div);
      });

    } catch (err) {
      console.error(err);
      spotlightEl.innerHTML = '<p>Unable to load spotlights.</p>';
    }
  }

  // run weather only if API key present
  if (OPENWEATHER_API_KEY && OPENWEATHER_API_KEY !== '96dd8607d22b7d21d2a2f28da81a68be') {
    loadWeather();
  } else {
    console.warn('OpenWeather API key not configured in scripts/home.js. Weather disabled until key is set.');
    currentTempEl.textContent = '--';
    currentDescEl.textContent = 'API key required';
    forecastListEl.innerHTML = '<li>Configure OpenWeather API key in scripts/home.js</li>';
  }

  loadSpotlights();
});
