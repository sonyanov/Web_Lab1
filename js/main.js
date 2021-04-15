window.onload = function () {
	defaultAdd();
  	navigator.geolocation.getCurrentPosition(setPosition, showError);
  	pressEnter();

  	document.querySelector('.add-favorite-location button').onclick = addFavorites;
  	document.querySelector('.header button').onclick = () => {
    	loading();
    	navigator.geolocation.getCurrentPosition(setPosition, showError);
  	};
}