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