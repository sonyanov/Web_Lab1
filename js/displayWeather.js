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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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

  clone.querySelector('.location-info-favorites-city button').onclick = () => {
    
    localStorage.removeItem(clone.querySelector('.location-info-favorites-city h3').innerHTML);
    gridLocation.removeChild(clone);
  };
}
