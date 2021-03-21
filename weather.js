

const cityElement = document.querySelector(".location-info-city h1");
const iconElement = document.querySelector(".picture_weather");
const tempElement = document.querySelector(".temperature-picture_weather p");
const windElement = document.querySelector(".wind p");
const descElement = document.querySelector(".description p");
const presElement = document.querySelector(".pressure p");
const humElement = document.querySelector(".humidity p");
const coordElement = document.querySelector(".coords p");

const weather = {};

weather.temperature = {
	unit : "celsius"
}

if('geolocation' in navigator){
	set_geo();
}else{

}

function set_geo() {
	navigator.geolocation.getCurrentPosition(setPosition, showError);
}


function setPosition(position) {
	let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    coordElement.innerHTML = `[${latitude.toFixed(2)};${longitude.toFixed(2)}]`;
    get_weather(latitude, longitude);
  
}

function showError(error) {
	const def_latitude = 55.753215;
	const def_longitude = 37.622504;
	coordElement.innerHTML = `[${def_latitude.toFixed(2)};${def_longitude.toFixed(2)}]`;
	get_weather(def_latitude, def_longitude);
}


const key = "cddaa27d924b1fe838386ed5cc22fde2"
const Kelvin = 273;

function get_weather(latitude, longitude) {

	let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

	fetch(api)  .then( function(response){

					let data = response.json();
					return data;
					})
				.then( function(data){

					weather.temperature.value = Math.floor(data.main.temp - Kelvin);//температура
					weather.description = data.weather[0].description;//облачность
					weather.iconId = data.weather[0].icon;//иконка
					weather.city = data.name//название города
					weather.pressure = data.main.pressure;//давление
					weather.humidity = data.main.humidity;//влажность
					weather.speed = data.wind.speed;//скорость
					weather.deg = data.wind.deg;//направление

				})
				.then( function(){

					displayweather();
				})

}

function displayweather() {

	console.log();
	
	cityElement.innerHTML = weather.city;
	iconElement.innerHTML = `<img src="png/${weather.iconId}.png"/>`;
	tempElement.innerHTML = `${weather.temperature.value}°C`;
	windElement.innerHTML = `${weather.speed} m/s, ${weather.deg}`;
	descElement.innerHTML = weather.description;
	presElement.innerHTML = `${weather.pressure} hpa`;
	humElement.innerHTML = `${weather.humidity} %`;



}