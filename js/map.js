'use strict';

(function () {
  window.map = {
    map: document.querySelector('.map'),

    pinBlock: document.querySelector('.map__pins'),

    filtersBlock: document.querySelector('.map__filters-container'),

    filtersForm: document.querySelector('.map__filters')
  };

  var MAX_PIN_COUNT = 5;

  var propertyTypeFilter = window.map.filtersBlock.querySelector('#housing-type');

  var isClosed = true;

  var onPopupEscPress = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();

      var cards = window.map.map.querySelectorAll('.map__card');

      for (var i = 0; i < cards.length; i++) {
        if (cards[i].style.display === 'block') {
          cards[i].style.display = 'none';
        }
      }
      isClosed = true;

      document.removeEventListener('keydown', onPopupEscPress);
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

  var addOnPinOpen = function (cardItem, pinItem) {
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

  var renderPinCard = function (data) {
    var fragmentPin = document.createDocumentFragment();
    var fragmentCard = document.createDocumentFragment();

    for (var i = 0; i < data.length; i++) {
      var cardItem = window.card.renderCard(data[i]);
      fragmentCard.appendChild(cardItem);
      addOnCardClose(cardItem);

      var pinItem = window.pin.renderPin(data[i]);
      fragmentPin.appendChild(pinItem);
      addOnPinOpen(cardItem, pinItem);
    }

    window.map.pinBlock.appendChild(fragmentPin);
    window.map.map.insertBefore(fragmentCard, window.map.filtersBlock);
  };

  var removePinCard = function () {
    var pins = window.map.map.querySelectorAll('button[type="button"]');
    var cards = window.map.map.querySelectorAll('.map__card');

    pins.forEach(function (pin) {
      pin.remove();
    });

    cards.forEach(function (card) {
      card.remove();
    });
  };

  var flats = [];

  var onSuccess = function (data) {
    flats = data;

    renderPinCard(flats);

    propertyTypeFilter.addEventListener('change', function (evt) {
      evt.preventDefault();

      removePinCard();

      var type = evt.target.value;

      var similarFlats = flats.filter(function (flat) {
        return flat.offer.type === type;
      });

      renderPinCard(similarFlats);

      var pins = window.map.map.querySelectorAll('button[type="button"]');

      for (var i = 0; i < pins.length; i++) {
        pins[i].style.display = 'block';
      }
    });

    window.main.activateForm(window.main.filtersItems);
  };

  window.backend.download(onSuccess, window.backend.onError);
})();
