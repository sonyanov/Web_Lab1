const weather = {};
const key = 'cddaa27d924b1fe838386ed5cc22fde2';
const api = 'https://api.openweathermap.org/data/2.5/weather?';

weather.temperature = {
  unit: 'celsius',
};

// Преобразование направление ветра
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

// Добавление и вывод информации о геолокации
function displayWeatheByCoords() {

  const cityElement = document.querySelector('.location-info-city h1');
  const iconElement = document.querySelector('.picture_weather');
  const tempElement = document.querySelector('.temperature-picture_weather p');
  const windElement = document.querySelector('.wind p');
  const desc = document.querySelector('.description p');
  const presElement = document.querySelector('.pressure p');
  const humElement = document.querySelector('.humidity p');
  const coordElement = document.querySelector('.coords p');

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

//Добавление и вывод информации о избанном городе
function displayWeatherByCity() {
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
    
    localStorage.removeItem(clone.querySelector('.location-info-favorites-city h3').innerHTML);
    gridLocation.removeChild(clone);
  };
}

//Обращение к апи по координатам
async function getResponseByCoords(latitude, longitude){
  const response = await fetch(api + `lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`);
  return response.json();
}

//Обращение к апи по городу
async function getResponseByCity(city){
  const response = await fetch(api + `q=${city}&appid=${key}&units=metric`);
  return response.json();
}

//Загрузка данных
function getWeather(data){

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
}

//Получение данных по координатам
async function getDatabyCoords(latitude, longitude){
  const data = await getResponseByCoords(latitude, longitude);
  await getWeather(data);
  displayWeatheByCoords();
}

//Получение данных по городу
async function getDatabyCity(city){
  const data = await getResponseByCity(city);
  await getWeather(data);
  displayWeatherByCity();
}

// Добавление избранных городов
function addFavorites() {
  const city = document.querySelector('.add-favorite-location input').value;
  getDatabyCity(city);
}

//Заставка на загрузку данных
function loadingCity() {
  const loaderLocation = document.querySelector('.location-weather');
  const loaderGrid = document.querySelector('.grid-favorites-location');
  const loader = document.querySelector('.loader');

  loader.style.display = 'none';

  loaderLocation.style.display = 'grid';
  loaderGrid.style.display = 'grid';
}

//Случай разрешения доступа геолокации
async function setPosition(position) {
  const { latitude } = position.coords;
  const { longitude } = position.coords;
  await getDatabyCoords(latitude, longitude);
  loadingCity();
}

//Случай блокировки геолокации
async function showError() {
  const defLatitude = 55.753215;
  const defLongitude = 37.622504;
  await getDatabyCoords(defLatitude, defLongitude);
  loadingCity();
}


// Добавление часто встречаемыхь городов
async function defaultAdd() {
  const defCity = ['Moscow', 'Madrid', 'London', 'New York'];
  const defKey = ['524901', '3117735', '2643743', '5128581']

  if (localStorage.length === 0) 
    for (let i = 0; i < defCity.length; i += 1) localStorage.setItem(defCity[i], defKey[i]);
  
  for (let i = 0; i < localStorage.length; i += 1) {
    await getDatabyCity(localStorage.key(i));
  }
}

navigator.geolocation.getCurrentPosition(setPosition, showError);
defaultAdd();

document.querySelector('.add-favorite-location button').onclick = addFavorites;
document.querySelector('.header button').onclick = () => {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
};