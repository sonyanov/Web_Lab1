const cityElement = document.querySelector(".location-info-city h1");
const iconElement = document.querySelector(".picture_weather");
const tempElement = document.querySelector(".temperature-picture_weather p");
const windElement = document.querySelector(".wind p");
const descElement = document.querySelector(".description p");
const presElement = document.querySelector(".pressure p");
const humElement = document.querySelector(".humidity p");
const coordElement = document.querySelector(".coords p");

const weather = {};

const key = "cddaa27d924b1fe838386ed5cc22fde2"
const Kelvin = 273;

weather.temperature = {
	unit : "celsius"
}

document.querySelector(".add-favorite-location button").onclick = add_favorites;
document.querySelector(".header button").onclick = () => {
	navigator.geolocation.getCurrentPosition(setPosition, showError);
}

navigator.geolocation.getCurrentPosition(setPosition, showError);


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

//get geolocation weather
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

//add favorites city 
function add_favorites() {

	let city = document.querySelector(".add-favorite-location input").value;

	localStorage.setItem(city, city);

	let api_city = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;

	fetch(api_city)  .then( function(response){

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
					weather.lat = data.coord.lat;
					weather.lon = data.coord.lon;

				})
				.then( function(){

					displayweatherfavcity();
				})

}

//add info about geolocation place
function displayweather() {
	
	cityElement.innerHTML = weather.city;
	iconElement.innerHTML = `<img src="png/${weather.iconId}.png"/>`;
	tempElement.innerHTML = `${weather.temperature.value}°C`;

	convert_deg();
	windElement.innerHTML = `${weather.speed} m/s, ${weather.deg}`;

	descElement.innerHTML = weather.description.charAt(0).toUpperCase() + weather.description.slice(1);

	presElement.innerHTML = `${weather.pressure} hpa`;
	humElement.innerHTML = `${weather.humidity} %`;
}

//add info about favorites city
function displayweatherfavcity() {

	const template = document.querySelector('#location-info-weather-grid');

	const favcityElement = template.content.querySelector(".location-info-favorites-city h3");
	const faviconElement = template.content.querySelector(".picture_weather-favorites");
	const favtempElement = template.content.querySelector(".location-info-favorites-city p");
	const favwindElement = template.content.querySelector(".favcity_wind p");
	const favdescElement = template.content.querySelector(".favcity_description p");
	const favpresElement = template.content.querySelector(".favcity_pressure p");
	const favhumElement = template.content.querySelector(".favcity_humidity p");
	const favcoordElement = template.content.querySelector(".favcity_coords p");

	
	favcityElement.innerHTML = weather.city;
	faviconElement.innerHTML = `<img src="png/${weather.iconId}.png"/>`;
	favtempElement.innerHTML = `${weather.temperature.value}°C`;

	convert_deg();
	favwindElement.innerHTML = `${weather.speed} m/s, ${weather.deg}`;

	favdescElement.innerHTML = weather.description.charAt(0).toUpperCase() + weather.description.slice(1);

	favpresElement.innerHTML = `${weather.pressure} hpa`;
	favhumElement.innerHTML = `${weather.humidity} %`;

	favcoordElement.innerHTML = `[${weather.lat.toFixed(2)};${weather.lon.toFixed(2)}]`;

	var clone = template.content.querySelector("div").cloneNode(true);
	var grig_location = document.querySelector(".grid-favorites-location");
	grig_location.appendChild(clone);

	clone.querySelector('.location-info-favorites-city button').onclick = () => {
    	grig_location.removeChild(clone);
    	localStorage.removeItem(clone.querySelector('.location-info-favorites-city h3').innerHTML)
	};
}

//add default city
function default_add(){
	const default_city = ['Moscow', 'Madrid', 'London', 'New York'];

	if(localStorage.length == 0){

		for (let i = 0; i < default_city.length; i++){

			localStorage.setItem(default_city[i], default_city[i]);

			let api_city = `http://api.openweathermap.org/data/2.5/weather?q=${localStorage.key(i)}&appid=${key}`;
		
			fetch(api_city)  .then( function(response){

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
							weather.lat = data.coord.lat;
							weather.lon = data.coord.lon;

						})
						.then( function(){

							displayweatherfavcity();
						})
		}
	}
	else {
		for (let i = 0; i < localStorage.length; i++) {

		let api_city = `http://api.openweathermap.org/data/2.5/weather?q=${localStorage.key(i)}&appid=${key}`;
		
		fetch(api_city)  .then( function(response){

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
						weather.lat = data.coord.lat;
						weather.lon = data.coord.lon;

					})
					.then( function(){

						displayweatherfavcity();
					})
		}
	}
}

//CONVERT WIND DEGREE TO TEXT INFO
function convert_deg() {


	if (weather.deg <= 21 || weather.deg >= 337)
		weather.deg = "North";
	if (weather.deg > 21 && weather.deg < 66)
		weather.deg = "North-East";
	if (weather.deg >=66 && weather.deg < 112)
		weather.deg = "East";
	if (weather.deg >= 112 && weather.deg < 156)
		weather.deg = "South-East";
	if (weather.deg >= 156 && weather.deg < 200)
		weather.deg = "South";
	if (weather.deg >=200 && weather.deg < 247)
		weather.deg = "South-West";
	if (weather.deg >= 247 && weather.deg < 280)
		weather.deg = "West";
	if (weather.deg >= 280 && weather.deg < 337)
		weather.deg = "North-West";

	return weather.deg;
}

default_add();

//TO DO:
// -сохранять добавленные города
// -прописать блоки при загрузке
// -обновление геолокации