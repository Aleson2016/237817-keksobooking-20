'use strict';

(function () {
  var MAINPIN_WIDTH_DEFAULT = 156;
  var MAINPIN_WIDTH_ACTIVE = 62;
  var MAINPIN_TAIL = 22;
  var X_MIN = 0;
  var Y_MIN = 130;
  var Y_MAX = 630;

  var pins = window.map.map.querySelectorAll('button[type="button"]');

  var mainPin = window.map.pinBlock.querySelector('.map__pin--main');

  var form = document.querySelector('.ad-form');

  var fieldsetItems = form.children;

  var propertyAddress = form.querySelector('#address');

  var getDefaultAddress = function (width) {
    propertyAddress.value = (parseInt(mainPin.style.left, 10) + MAINPIN_WIDTH_DEFAULT / 2) + ', ' + (parseInt(mainPin.style.top, 10) + MAINPIN_WIDTH_DEFAULT / 2);
  };

  var getActiveAddress = function () {
    propertyAddress.value = (parseInt(mainPin.style.left, 10) + MAINPIN_WIDTH_ACTIVE / 2) + ', ' + (parseInt(mainPin.style.top, 10) + MAINPIN_WIDTH_ACTIVE + MAINPIN_TAIL);
  }

  var blockPage = function () {
    for (var i = 0; i < pins.length; i++) {
      pins[i].style.display = 'none';
    }

    for (var j = 0; j < fieldsetItems.length; j++) {
      fieldsetItems[j].setAttribute('disabled', 'true');
    }

    getDefaultAddress();
  };

  var activatePage = function () {
    window.map.map.classList.remove('map--faded');

    for (var i = 0; i < pins.length; i++) {
      pins[i].style.display = 'block';
    }

    for (var j = 0; j < fieldsetItems.length; j++) {
      fieldsetItems[j].removeAttribute('disabled');
    }

    getActiveAddress();
  };

  var onMainPinClick = function (evt) {
    evt.preventDefault();

    if (evt.which === 1) {
      activatePage();

      mainPin.removeEventListener('keydown', onEnterPress);

      mainPin.removeEventListener('mousedown', onMainPinClick);
    }
  };

  var onEnterPress = function (evt) {
    if (evt.key === 'Enter') {
      activatePage();

      mainPin.removeEventListener('mousedown', onMainPinClick);

      mainPin.removeEventListener('keydown', onEnterPress);
    }
  };

  blockPage();

  mainPin.addEventListener('mousedown', onMainPinClick);

  mainPin.addEventListener('keydown', onEnterPress);

  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var mainPinX = mainPin.offsetLeft - shift.x;
      var mainPinY = mainPin.offsetTop - shift.y;
      var xMax = window.map.map.offsetWidth;

      if (mainPinX >= (X_MIN - MAINPIN_WIDTH_ACTIVE / 2) && mainPinX <= (xMax - MAINPIN_WIDTH_ACTIVE / 2)) {
        mainPin.style.left = mainPinX + 'px';
      }

      if (mainPinY >= (Y_MIN - (MAINPIN_WIDTH_ACTIVE + MAINPIN_TAIL)) && mainPinY <= (Y_MAX - (MAINPIN_WIDTH_ACTIVE + MAINPIN_TAIL))) {
        mainPin.style.top = mainPinY + 'px';
      }

      getActiveAddress();
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
