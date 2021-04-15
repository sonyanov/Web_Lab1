
//Заставка на загрузку данных
function loadingCity() {
  const loaderLocation = document.querySelector('.location-weather');
  const loaderGrid = document.querySelector('.grid-favorites-location');
  const loader = document.querySelector('.loader');
  loader.style.display = 'none';
  loaderLocation.style.display = 'grid';
  loaderGrid.style.display = 'grid';
}

function loading(){
  const loaderLocation = document.querySelector('.location-weather');
  const loader = document.querySelector('.loader');

  loader.style.display = 'flex';
  loaderLocation.style.display = 'none';
  
}