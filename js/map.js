'use strict';

(function () {
  window.map = {
    map: document.querySelector('.map'),

    pinBlock: document.querySelector('.map__pins'),

    filtersBlock: document.querySelector('.map__filters-container'),

    filtersForm: document.querySelector('.map__filters')
  };

  var MAX_PIN_COUNT = 5;

  var filtersNames = {
    'housing-type': 'type',
    'housing-price': 'price',
    'housing-rooms': 'rooms',
    'housing-guests': 'capacity',
    'housing-features': 'features'
  };

  var prices = {
    low: 10000,
    high: 50000
  };

  var propertyFilterItems = window.map.filtersForm.querySelectorAll('select');

  var propertyFeaturesFilter = window.map.filtersBlock.querySelector('#housing-features');

  var propertyFeaturesItems = propertyFeaturesFilter.querySelectorAll('input[type="checkbox"]');

  var isClosed = true;

  var onPopupEscPress = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();

      var pins = window.map.map.querySelectorAll('button[type="button"]');

      for (var i = 0; i < pins.length; i++) {
        if (pins[i].classList.contains('.map__pin--active')) {
          pins[i].classList.remove('.map__pin--active');
        }
      }

      var cards = window.map.map.querySelectorAll('.map__card');

      for (var j = 0; j < cards.length; j++) {
        if (cards[j].style.display === 'block') {
          cards[j].style.display = 'none';
        }
      }

      isClosed = true;

      document.removeEventListener('keydown', onPopupEscPress);
    }
  };

  var openPopup = function (pinItem, cardItem) {
    pinItem.classList.add('.map__pin--active');
    cardItem.style.display = 'block';

    isClosed = false;

    document.addEventListener('keydown', onPopupEscPress);
  };

  var closePopup = function (pinItem, cardItem) {
    pinItem.classList.remove('.map__pin--active');
    cardItem.style.display = 'none';

    isClosed = true;

    document.removeEventListener('keydown', onPopupEscPress);
  };

  var addOnPinOpen = function (cardItem, pinItem) {
    pinItem.addEventListener('click', function () {
      if (isClosed) {
        openPopup(pinItem, cardItem);
      } else {
        var cards = window.map.map.querySelectorAll('.map__card');

        for (var i = 0; i < cards.length; i++) {
          if (cards[i].style.display === 'block') {
            cards[i].style.display = 'none';
          }
        }
        openPopup(pinItem, cardItem);
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

  var filter = {
    'type': function (value, flats) {
      var similarFlats = flats.filter(function (flat) {
        return flat.offer.type === value;
      });
      return similarFlats;
    },

    'price': function (value, flats) {
      if (value === 'low') {
        var similarFlats = flats.filter(function (flat) {
          return parseInt(flat.offer.price, 10) < prices.low;
        });
      } else if (value === 'middle') {
        similarFlats = flats.filter(function (flat) {
          return (parseInt(flat.offer.price, 10) >= prices.low && parseInt(flat.offer.price, 10) <= prices.high);
        });
      } else if (value === 'high') {
        similarFlats = flats.filter(function (flat) {
          return parseInt(flat.offer.price, 10) > prices.high;
        });
      }
      return similarFlats;
    },

    'rooms': function (value, flats) {
      var similarFlats = flats.filter(function (flat) {
        return parseInt(flat.offer.rooms, 10) === parseInt(value, 10);
      });
      return similarFlats;
    },

    'capacity': function (value, flats) {
      if (value === '1') {
        var similarFlats = flats.filter(function (flat) {
          return parseInt(flat.offer.guests, 10) === 1;
        });
      } else if (value === '2') {
        similarFlats = flats.filter(function (flat) {
          return parseInt(flat.offer.guests, 10) === 2;
        });
      } else if (value === '0') {
        similarFlats = flats.filter(function (flat) {
          return parseInt(flat.offer.guests, 10) >= 3;
        });
      }
      return similarFlats;
    }
  };

  var filterFeatures = function (checkedFeatures, flats) {
    var similarFlats = [];

    if (checkedFeatures.length === 1) {
      similarFlats = flats.filter(function (flat) {
        return flat.offer.features.indexOf(checkedFeatures[0].value) !== -1;
      });
    } else {
      similarFlats = flats.filter(function (flat) {
        return flat.offer.features.indexOf(checkedFeatures[0].value) !== -1;
      });

      for (var i = 1; i < checkedFeatures.length; i++) {
        var filteredFlats = similarFlats.filter(function (similarFlat) {
          return similarFlat.offer.features.indexOf(checkedFeatures[i].value) !== -1;
        });
        similarFlats = filteredFlats;
      }
    }
    return similarFlats;
  };

  var filterSelects = function (checkedFilters) {
    var selectedFlats = [];

    if (checkedFilters.length === 1) {

      var value = checkedFilters[0].value;
      selectedFlats = filter[filtersNames[checkedFilters[0].name]](value, flats);

    } else {

      value = checkedFilters[0].value;
      selectedFlats = filter[filtersNames[checkedFilters[0].name]](value, flats);

      for (var i = 1; i < checkedFilters.length; i++) {
        value = checkedFilters[i].value;

        var filteredFlats = filter[filtersNames[checkedFilters[i].name]](value, selectedFlats);
        selectedFlats = filteredFlats;
      }
    }

    return selectedFlats;
  };

  var renderFilteredFlats = function (items) {
    if (items.length <= MAX_PIN_COUNT) {
      renderPinCard(items);
    } else {
      items.length = MAX_PIN_COUNT;
      renderPinCard(items);
    }
  };

  var flats = [];

  var onSuccess = function (data) {
    flats = data;

    renderPinCard(flats);

    window.map.filtersForm.addEventListener('change', function (evt) {
      evt.preventDefault();

      removePinCard();

      var checkedFilters = [];
      var checkedFeatures = [];

      propertyFilterItems.forEach(function (propertyFilterItem) {
        if (propertyFilterItem.value !== 'any') {
          checkedFilters.push(propertyFilterItem);
        }
      });

      propertyFeaturesItems.forEach(function (propertyFeaturesItem) {
        if (propertyFeaturesItem.checked) {
          checkedFeatures.push(propertyFeaturesItem);
        }
      });

      if (checkedFilters.length === 0 && checkedFeatures.length === 0) {
        renderPinCard(flats);
      } else if (checkedFilters.length > 0 && checkedFeatures.length === 0) {
        var selectedFlats = filterSelects(checkedFilters);

        renderFilteredFlats(selectedFlats);

      } else if (checkedFilters.length === 0 && checkedFeatures.length > 0) {
        var similarFlats = filterFeatures(checkedFeatures, flats);

        renderFilteredFlats(similarFlats);

      } else if (checkedFilters.length > 0 && checkedFeatures.length > 0) {
        selectedFlats = filterSelects(checkedFilters);

        similarFlats = filterFeatures(checkedFeatures, selectedFlats);

        renderFilteredFlats(similarFlats);
      }

      var pins = window.map.map.querySelectorAll('button[type="button"]');

      for (var i = 0; i < pins.length; i++) {
        pins[i].style.display = 'block';
      }
    });

    window.main.activateForm(window.main.filtersItems);
  };

  window.backend.download(onSuccess, window.backend.onError);
})();
