
const weather = {};
const key = 'cddaa27d924b1fe838386ed5cc22fde2';
const api = 'https://api.openweathermap.org/data/2.5/weather?';

weather.temperature = {
  unit: 'celsius',
};
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
  if (data.cod == "404") window.alert(data.message);
  else await getWeather(data);
  displayWeatheByCoords();
}

//Получение данных по городу
async function getDatabyCity(city){
  const data = await getResponseByCity(city);

  if(data.id != localStorage.getItem(data.name) ){
    localStorage.setItem(data.name, data.id);
    if (data.cod == "404") window.alert(data.message);
    else await getWeather(data);

    displayWeatherByCity();
  }
  else if(data.cod == "404") window.alert(data.message);
      else window.alert("Такой город уже указан")
}