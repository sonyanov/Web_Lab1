// Добавление часто встречаемыхь городов
async function defaultAdd() {
  const defCity = ['Moscow', 'Madrid', 'London', 'New York'];
  const defKey = ['524901', '3117735', '2643743', '5128581']

  if (localStorage.length === 0) 
    for (let i = 0; i < defCity.length; i += 1) localStorage.setItem(defCity[i], defKey[i]);

  let data = await Promise.all(Object.entries(localStorage).map((tuple) => {
    return getResponseByCity(tuple[0]);
  }))

  for (let i = 0; i < data.length; i+=1){
    if (data.cod == "404") window.alert(data.message);
    else {
      getWeather(data[i]);
      await displayWeatherByCity();
    }
  }
}

// Добавление избранных городов
function addFavorites() {
  const city = document.querySelector('.add-favorite-location input').value;
  getDatabyCity(city);
}

function pressEnter() {

  document.querySelector('.input').addEventListener('keypress',
      function (e) {
        if (e.key === 'Enter' && document.querySelector('.input').value !== "") {
          addFavorites();
        }
      });
}