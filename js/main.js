'use strict';

var MAINPIN_WIDTH_DEFAULT = 156;
var MAINPIN_WIDTH_ACTIVE = 62;
var MAINPIN_TAIL = 22;

var pins = window.map.map.querySelectorAll('button[type="button"]');

var mainPin = window.map.pinBlock.querySelector('.map__pin--main');

var form = document.querySelector('.ad-form');

var fieldsetItems = form.children;

var propertyAddress = form.querySelector('#address');

var blockPage = function () {
  for (var i = 0; i < pins.length; i++) {
    pins[i].style.display = 'none';
  }

  for (var j = 0; j < fieldsetItems.length; j++) {
    fieldsetItems[j].setAttribute('disabled', 'true');
  }

  propertyAddress.value = (parseInt(mainPin.style.left, 10) + MAINPIN_WIDTH_DEFAULT / 2) + ', ' + (parseInt(mainPin.style.top, 10) + MAINPIN_WIDTH_DEFAULT / 2);
};

var activatePage = function () {
  window.map.map.classList.remove('map--faded');

  for (var i = 0; i < pins.length; i++) {
    pins[i].style.display = 'block';
  }

  for (var j = 0; j < fieldsetItems.length; j++) {
    fieldsetItems[j].removeAttribute('disabled');
  }

  propertyAddress.value = (parseInt(mainPin.style.left, 10) + MAINPIN_WIDTH_ACTIVE / 2) + ', ' + (parseInt(mainPin.style.top, 10) + MAINPIN_WIDTH_ACTIVE + MAINPIN_TAIL);
};

blockPage();

mainPin.addEventListener('mousedown', function () {
  if (event.which === 1) {
    activatePage();
  }
});

mainPin.addEventListener('keydown', function (evt) {
  if (evt.key === 'Enter') {
    activatePage();
  }
});
