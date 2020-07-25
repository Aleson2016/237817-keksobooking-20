'use strict';

(function () {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  window.pin.renderPin = function (item) {
    var pin = pinTemplate.cloneNode(true);

    pin.style.left = item.location.x + 'px';
    pin.style.top = item.location.y + 'px';

    pin.querySelector('img').src = item.author.avatar;

    return pin;
  };
})();
