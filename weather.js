const cityElement = document.querySelector('.location-info-city h1');
const iconElement = document.querySelector('.picture_weather');
const tempElement = document.querySelector('.temperature-picture_weather p');
const windElement = document.querySelector('.wind p');
const desc = document.querySelector('.description p');
const presElement = document.querySelector('.pressure p');
const humElement = document.querySelector('.humidity p');
const coordElement = document.querySelector('.coords p');

const weather = {};
const key = 'cddaa27d924b1fe838386ed5cc22fde2';

weather.temperature = {
  unit: 'celsius',
};

// CONVERT WIND DEGREE TO TEXT INFO
function convertDeg() {
  if (weather.deg <= 21 || weather.deg >= 337) { weather.deg = 'North'; }
  if (weather.deg > 21 && weather.deg < 66) { weather.deg = 'North-East'; }
  if (weather.deg >= 66 && weather.deg < 112) { weather.deg = 'East'; }
  if (weather.deg >= 112 && weather.deg < 156) { weather.deg = 'South-East'; }
  if (weather.deg >= 156 && weather.deg < 200) { weather.deg = 'South'; }
  if (weather.deg >= 200 && weather.deg < 247) { weather.deg = 'South-West'; }
  if (weather.deg >= 247 && weather.deg < 280) { weather.deg = 'West'; }
  if (weather.deg >= 280 && weather.deg < 337) { weather.deg = 'North-West'; }

  return weather.deg;
}

// add info about geolocation place
function displayWeather() {
  cityElement.innerHTML = weather.city;
  iconElement.innerHTML = `<img src="png/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `${weather.temperature.value}°C`;

  convertDeg();
  windElement.innerHTML = `${weather.speed} m/s, ${weather.deg}`;

  desc.innerHTML = weather.description.charAt(0).toUpperCase() + weather.description.slice(1);

  presElement.innerHTML = `${weather.pressure} hpa`;
  humElement.innerHTML = `${weather.humidity} %`;

  coordElement.innerHTML = `[${weather.lat.toFixed(2)};${weather.lon.toFixed(2)}]`;
}

// add info about favorites city
function displayWeatherFavCity() {
  const template = document.querySelector('#location-info-weather-grid');

  const favcityElement = template.content.querySelector('.location-info-favorites-city h3');
  const faviconElement = template.content.querySelector('.picture_weather-favorites');
  const favtempElement = template.content.querySelector('.location-info-favorites-city p');
  const favwindElement = template.content.querySelector('.favcity_wind p');
  const favdesc = template.content.querySelector('.favcity_description p');
  const favpresElement = template.content.querySelector('.favcity_pressure p');
  const favhumElement = template.content.querySelector('.favcity_humidity p');
  const favcoordElement = template.content.querySelector('.favcity_coords p');

  favcityElement.innerHTML = weather.city;
  faviconElement.innerHTML = `<img src="png/${weather.iconId}.png"/>`;
  favtempElement.innerHTML = `${weather.temperature.value}°C`;

  convertDeg();
  favwindElement.innerHTML = `${weather.speed} m/s, ${weather.deg}`;

  favdesc.innerHTML = weather.description.charAt(0).toUpperCase() + weather.description.slice(1);

  favpresElement.innerHTML = `${weather.pressure} hpa`;
  favhumElement.innerHTML = `${weather.humidity} %`;

  favcoordElement.innerHTML = `[${weather.lat.toFixed(2)};${weather.lon.toFixed(2)}]`;

  const clone = template.content.querySelector('div').cloneNode(true);
  const gridLocation = document.querySelector('.grid-favorites-location');
  gridLocation.appendChild(clone);

  clone.querySelector('.location-info-favorites-city button').onclick = () => {
    gridLocation.removeChild(clone);
    localStorage.removeItem(clone.querySelector('.location-info-favorites-city h3').innerHTML);
  };
}

// get geolocation weather
function getWeather(latitude, longitude) {
  const api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`;

  fetch(api).then((response) => {
    const data = response.json();
    return data;
  })
    .then((data) => {
      weather.temperature.value = Math.round(data.main.temp);// температура
      weather.description = data.weather[0].description;// облачность
      weather.iconId = data.weather[0].icon;// иконка
      weather.city = data.name;// название города
      weather.pressure = data.main.pressure;// давление
      weather.humidity = data.main.humidity;// влажность
      weather.speed = data.wind.speed;// скорость
      weather.deg = data.wind.deg;// направление
      weather.lat = data.coord.lat;
      weather.lon = data.coord.lon;
    })
    .then(() => {
      displayWeather();
    });
}

// add info about favorites city
function apiCityAdd(apiCity) {
  fetch(apiCity).then((response) => {
    const data = response.json();
    return data;
  })
    .then((data) => {
      if (data.cod !== '404') { localStorage.setItem(data.name, data.name); } else { window.alert(`${data.message}`); }

      weather.temperature.value = Math.round(data.main.temp);// температура
      weather.description = data.weather[0].description;// облачность
      weather.iconId = data.weather[0].icon;// иконка
      weather.city = data.name;// название города
      weather.pressure = data.main.pressure;// давление
      weather.humidity = data.main.humidity;// влажность
      weather.speed = data.wind.speed;// скорость
      weather.deg = data.wind.deg;// направление
      weather.lat = data.coord.lat;
      weather.lon = data.coord.lon;
    })
    .then(() => {
      displayWeatherFavCity();
    });
}

// add favorites city
function addFavorites() {
  const city = document.querySelector('.add-favorite-location input').value;

  if (city !== localStorage.getItem(city)) {
    const apiCity = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;
    apiCityAdd(apiCity);
  }
}

function loadingCity() {
  const loaderLocation = document.querySelector('#location-weather');
  const loaderGrid = document.querySelector('.grid-favorites-location');
  const loader = document.querySelector('.loader');

  loader.style.display = 'none';

  loaderLocation.style.display = 'flex';
  loaderGrid.style.display = 'grid';
}

function setPosition(position) {
  loadingCity();
  const { latitude } = position.coords;
  const { longitude } = position.coords;
  getWeather(latitude, longitude);
}

function showError() {
  loadingCity();
  const defLatitude = 55.753215;
  const defLongitude = 37.622504;
  getWeather(defLatitude, defLongitude);
}

document.querySelector('.add-favorite-location button').onclick = addFavorites;
document.querySelector('.header button').onclick = () => {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
};

// add default city
function defaultAdd() {
  const defCity = ['Moscow', 'Madrid', 'London', 'New York'];

  if (localStorage.length === 0) {
    for (let i = 0; i < defCity.length; i += 1) localStorage.setItem(defCity[i], defCity[i]);
  }

  for (let i = 0; i < localStorage.length; i += 1) {
    const apiCity = `https://api.openweathermap.org/data/2.5/weather?q=${localStorage.key(i)}&appid=${key}&units=metric`;
    apiCityAdd(apiCity);
  }
}

function main() {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
  defaultAdd();
}

main();
