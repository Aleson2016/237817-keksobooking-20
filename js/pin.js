'use strict';

(function () {

  var pinBlock = window.map.querySelector('.map__pins');

  window.pins = window.map.querySelectorAll('button[type="button"]');

  window.mainPin = pinBlock.querySelector('.map__pin--main');

  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var renderPin = function (item) {
    var pin = pinTemplate.cloneNode(true);
    pin.style.left = item.location.x + 'px';
    pin.style.top = item.location.y + 'px';

    pin.querySelector('img').src = item.author.avatar;

    return pin;
  };

})();
