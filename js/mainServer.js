const weather = {};
const serverUrl = 'https://serverweather.herokuapp.com';
const weatherCity = '/weather/city?';
const weatherCoords = '/weather/coordinates?';
const favorites = '/favorites'

weather.temperature = {
  unit: 'celsius',
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Добавление и вывод информации о геолокации
function displayWeatheByCoords(data) {

  const cityElement = document.querySelector('.location-info-city h1');
  const iconElement = document.querySelector('.picture_weather');
  const tempElement = document.querySelector('.temperature-picture_weather p');
  const windElement = document.querySelector('.wind p');
  const desc = document.querySelector('.description p');
  const presElement = document.querySelector('.pressure p');
  const humElement = document.querySelector('.humidity p');
  const coordElement = document.querySelector('.coords p');

  cityElement.innerHTML = data.name;
  iconElement.innerHTML = `<img src="png/${data.icon}.png"/>`;
  tempElement.innerHTML = data.temp;

  windElement.innerHTML = data.wind;

  desc.innerHTML = data.description.charAt(0).toUpperCase() + data.description.slice(1);

  presElement.innerHTML = data.pressure;
  humElement.innerHTML = data.humidity;

  coordElement.innerHTML = `[${data.coord.lat.toFixed(2)};${data.coord.lon.toFixed(2)}]`;
}

//Добавление и вывод информации о избанном городе
async function displayWeatherByCity(data) {
  const template = document.querySelector('#location-info-weather-grid');

  const favcityElement = template.content.querySelector('.location-info-favorites-city h3');
  const faviconElement = template.content.querySelector('.picture_weather-favorites');
  const favtempElement = template.content.querySelector('.location-info-favorites-city p');
  const favwindElement = template.content.querySelector('.favcity_wind p');
  const favdesc = template.content.querySelector('.favcity_description p');
  const favpresElement = template.content.querySelector('.favcity_pressure p');
  const favhumElement = template.content.querySelector('.favcity_humidity p');
  const favcoordElement = template.content.querySelector('.favcity_coords p');

  favcityElement.innerHTML = data.name;
  faviconElement.innerHTML = `<img src="png/${data.icon}.png"/>`;
  favtempElement.innerHTML = data.temp;

  favwindElement.innerHTML = data.wind;

  favdesc.innerHTML = data.description.charAt(0).toUpperCase() + data.description.slice(1);

  favpresElement.innerHTML = data.pressure;
  favhumElement.innerHTML = data.humidity;

  favcoordElement.innerHTML = `[${data.coord.lat.toFixed(2)};${data.coord.lon.toFixed(2)}]`;

  const clone = template.content.querySelector('.clone').cloneNode(true);
  const gridLocation = document.querySelector('.grid-favorites-location');

  gridLocation.appendChild(clone);

  const loaderGrid =clone.querySelector('.loader-city');
  const div = clone.querySelector('.location-info-favorites-city')
  const ul = clone.querySelector('ul');

  loaderGrid.style.display = 'flex';
  ul.style.display = 'none';
  div.style.display ='none';
  
  sleep(500).then(() => {
    ul.style.display = 'block'
    div.style.display ='flex';
    loaderGrid.style.display = 'none';
  })

  clone.querySelector('.location-info-favorites-city button').onclick = async () => {
    
    await fetch(serverUrl + favorites + `?q=${clone.querySelector('.location-info-favorites-city h3').innerHTML}`, {
      method: 'DELETE'
    });
    gridLocation.removeChild(clone);
  };
}

//Обращение к апи по координатам
async function getResponseByCoords(latitude, longitude){
  const response = await( await fetch(serverUrl + weatherCoords + `lat=${latitude}&lon=${longitude}`, {
    method: 'GET'
  })).json();
  return response;
}

//Обращение к апи по городу
async function getResponseByCity(city){
  const response = await( await fetch(serverUrl + weatherCity + `q=${city}`, {
    method: 'GET'
  })).json();
  return response;
}

//Получение данных по координатам
async function getDatabyCoords(latitude, longitude){
  const data = await getResponseByCoords(latitude, longitude);  
  displayWeatheByCoords(data);
}

//Получение данных по городу
async function getDatabyCity(city){
  const data = await getResponseByCity(city);
  displayWeatherByCity(data);
}

//Добавление избранных городов
async function addFavorites() {
  const city = document.querySelector('.add-favorite-location input').value.trim();
  try {
        const response = await( await fetch(serverUrl + favorites + `?q=${city}`, {
          method: 'POST' 
        })).json();
        if(response.name !== undefined){
           displayWeatherByCity(response);
        }
        else window.alert("Такой город уже есть")
  }catch (err) {
    window.alert("City not found")
  } 
}

//Заставка на загрузку данных
function loadingCity() {
  const loaderLocation = document.querySelector('.location-weather');
  const loader = document.querySelector('.loader');
  loader.style.display = 'none';
  loaderLocation.style.display = 'grid';
}

function loading(){
  const loaderLocation = document.querySelector('.location-weather');
  const loader = document.querySelector('.loader');

  loader.style.display = 'flex';
  loaderLocation.style.display = 'none';
  
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

  const data = await( await fetch(serverUrl + favorites, {
      method: 'GET'
    })).json();

  for (let i = 0; i < data.length; i+=1){
      await displayWeatherByCity(data[i]);
  }
}

function pressEnter() {

  document.querySelector('.input').addEventListener('keypress',
      function (e) {
        if (e.key === 'Enter' && document.querySelector('.input').value !== "") {
          addFavorites();
        }
      });
}

async function main(){
  defaultAdd();
  navigator.geolocation.getCurrentPosition(setPosition, showError);
  pressEnter();

  document.querySelector('.add-favorite-location button').onclick = addFavorites;
  document.querySelector('.header button').onclick = () => {
    loading();
    navigator.geolocation.getCurrentPosition(setPosition, showError);
  };
}

main();

