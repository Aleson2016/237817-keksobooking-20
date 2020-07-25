'use strict';

(function () {
  window.map = {
    map: document.querySelector('.map'),
    pinBlock: document.querySelector('.map__pins')
  };

  var mapFiltersBlock = window.map.map.querySelector('.map__filters-container');

  var isClosed = true;

  var onPopupEscPress = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();

      for (var i = 0; i < cards.length; i++) {
        if (cards[i].style.display === 'block') {
          cards[i].style.display = 'none';
        }
      }
      closePopup(cardItem);
    }
  };

  var openPopup = function (cardItem) {
    cardItem.style.display = 'block';

    isClosed = false;

    document.addEventListener('keydown', onPopupEscPress);
  };

  var closePopup = function (cardItem) {
    cardItem.style.display = 'none';

    isClosed = true;

    document.removeEventListener('keydown', onPopupEscPress);
  };

  var addOnPinOpen = function (cardItem) {
    pinItem.addEventListener('click', function () {
      if (isClosed) {
        openPopup(cardItem);
      }
    });
  };

  var addOnCardClose = function (cardItem) {
    cardItem.querySelector('.popup__close').addEventListener('click', function () {
      closePopup(cardItem);
    });
  };

  var fragmentPin = document.createDocumentFragment();
  var fragmentCard = document.createDocumentFragment();

  for (var i = 0; i < window.data.flats.length; i++) {
    var cardItem = window.card.renderCard(window.data.flats[i]);
    fragmentCard.appendChild(cardItem);
    addOnCardClose(cardItem);

    var pinItem = window.pin.renderPin(window.data.flats[i]);
    fragmentPin.appendChild(pinItem);
    addOnPinOpen(cardItem);
  }

  window.map.pinBlock.appendChild(fragmentPin);
  window.map.map.insertBefore(fragmentCard, mapFiltersBlock);

  var cards = window.map.map.querySelectorAll('.map__card');

})();
