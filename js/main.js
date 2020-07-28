'use strict';

(function () {
  var MAINPIN_WIDTH_DEFAULT = 156;
  var MAINPIN_DEFAULT_X = 570;
  var MAINPIN_DEFAULT_Y = 375;
  var MAINPIN_WIDTH_ACTIVE = 62;
  var MAINPIN_TAIL = 22;
  var X_MIN = 0;
  var Y_MIN = 130;
  var Y_MAX = 630;

  var form = document.querySelector('.ad-form');

  var formItems = form.children;

  var propertyAddress = form.querySelector('#address');

  var getDefaultAddress = function () {
    window.main.mainPin.style.left = MAINPIN_DEFAULT_X + 'px';
    window.main.mainPin.style.top = MAINPIN_DEFAULT_Y + 'px';
    propertyAddress.value = (parseInt(MAINPIN_DEFAULT_X, 10) + MAINPIN_WIDTH_DEFAULT / 2) + ', ' + (parseInt(MAINPIN_DEFAULT_Y, 10) + MAINPIN_WIDTH_DEFAULT / 2);
  };

  var getActiveAddress = function () {
    propertyAddress.value = (parseInt(window.main.mainPin.style.left, 10) + MAINPIN_WIDTH_ACTIVE / 2) + ', ' + (parseInt(window.main.mainPin.style.top, 10) + MAINPIN_WIDTH_ACTIVE + MAINPIN_TAIL);
  };

  var blockForm = function (items) {
    for (var i = 0; i < items.length; i++) {
      items[i].setAttribute('disabled', 'true');
    }
  };

  window.main = {
    mainPin: window.map.pinBlock.querySelector('.map__pin--main'),

    filtersItems: window.map.filtersForm.children,

    blockPage: function () {
      if (!window.map.map.classList.contains('map--faded')) {
        window.map.map.classList.add('map--faded');
      }

      var pins = window.map.map.querySelectorAll('button[type="button"]');

      for (var i = 0; i < pins.length; i++) {
        pins[i].style.display = 'none';
      }

      blockForm(formItems);

      blockForm(window.main.filtersItems);

      getDefaultAddress();
    },

    onMainPinClick: function (evt) {
      evt.preventDefault();

      if (evt.which === 1) {
        activatePage();

        window.main.mainPin.removeEventListener('keydown', window.main.onEnterPress);

        window.main.mainPin.removeEventListener('mousedown', window.main.onMainPinClick);
      }
    },

    onEnterPress: function (evt) {
      if (evt.key === 'Enter') {
        activatePage();

        window.main.mainPin.removeEventListener('mousedown', window.main.onMainPinClick);

        window.main.mainPin.removeEventListener('keydown', window.main.onEnterPress);
      }
    },

    activateForm: function (items) {
      for (var i = 0; i < items.length; i++) {
        items[i].removeAttribute('disabled');
      }
    }

  };

  var activatePage = function () {
    window.map.map.classList.remove('map--faded');

    var pins = window.map.map.querySelectorAll('button[type="button"]');

    for (var i = 0; i < pins.length; i++) {
      pins[i].style.display = 'block';
    }

    window.main.activateForm(formItems);

    getActiveAddress();
  };

  window.main.blockPage();

  window.main.mainPin.addEventListener('mousedown', window.main.onMainPinClick);

  window.main.mainPin.addEventListener('keydown', window.main.onEnterPress);

  window.main.mainPin.addEventListener('mousedown', function (evt) {
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

      var mainPinX = window.main.mainPin.offsetLeft - shift.x;
      var mainPinY = window.main.mainPin.offsetTop - shift.y;
      var xMax = window.map.map.offsetWidth;

      if (mainPinX >= (X_MIN - MAINPIN_WIDTH_ACTIVE / 2) && mainPinX <= (xMax - MAINPIN_WIDTH_ACTIVE / 2)) {
        window.main.mainPin.style.left = mainPinX + 'px';
      }

      if (mainPinY >= (Y_MIN - (MAINPIN_WIDTH_ACTIVE + MAINPIN_TAIL)) && mainPinY <= (Y_MAX - (MAINPIN_WIDTH_ACTIVE + MAINPIN_TAIL))) {
        window.main.mainPin.style.top = mainPinY + 'px';
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
