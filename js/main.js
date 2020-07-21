'use strict';

var MIN_NUMBER = 1;
var MAX_NUMBER = 8;
var MIN_X = 0;
var MAX_X = 930;
var MIN_Y = 130;
var MAX_Y = 630;

var flatTypes = ['palace', 'flat', 'house', 'bungalo'];

var checkTimes = ['12:00', '13:00', '14:00'];

var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var map = document.querySelector('.map');

var pinBlock = map.querySelector('.map__pins');

var mapFiltersBlock = map.querySelector('.map__filters-container');

var mainPin = pinBlock.querySelector('.map__pin--main');

var form = document.querySelector('.ad-form');

var fieldsetItems = form.children;

var propertyAddress = form.querySelector('#address');

var propertyType = form.querySelector('#type');

var propertyPrice = form.querySelector('#price');

var propertyCheckin = form.querySelector('#timein');

var propertyCheckout = form.querySelector('#timeout');

var propertyRooms = form.querySelector('#room_number');

var propertyCapacity = form.querySelector('#capacity');

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var getMixedArray = function (min, max) {
  var comments = [];

  while (comments.length < max) {
    var el = getRandomNumber(min, max);
    if (comments.indexOf(el) === -1) {
      comments.push(el);
    }
  }
  return comments;
}

var getRandomArray = function (arr) {
  var items = [];

  items.length = getRandomNumber(MIN_NUMBER, arr.length);

  for (var i = 0; i < items.length; i++) {
    items[i] = arr[i];
  }
  return items;
}

// database
var flats = [];
var avatars = getMixedArray(MIN_NUMBER, MAX_NUMBER);
var locations = [];

for (var i = 0; i < MAX_NUMBER; i++) {
  locations[i] = {
    x: getRandomNumber(MIN_X, MAX_X),
    y: getRandomNumber(MIN_Y, MAX_Y),
  }

  flats[i] = {
    'author': {
      'avatar': 'img/avatars/user0' + avatars[i] + '.png',
    },
    'offer': {
      'title': '',
      'address': locations[i].x + ', ' + locations[i].y,
      'price': '',
      'type': flatTypes[getRandomNumber(0, flatTypes.length - 1)],
      'rooms': '',
      'guests': '',
      'checkin': checkTimes[getRandomNumber(0, checkTimes.length - 1)],
      'checkout': checkTimes[getRandomNumber(0, checkTimes.length - 1)],
      'features': getRandomArray(features),
      'description': '',
      'photos': getRandomArray(photos),
    },
    'location': {
      'x': locations[i].x,
      'y': locations[i].y,
    }
  }
}

// pins and cards
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

var renderPin = function (item) {
  var pin = pinTemplate.cloneNode(true);
  pin.style.left = item.location.x + 'px';
  pin.style.top = item.location.y + 'px';

  pin.querySelector('img').src = item.author.avatar;

  return pin;
}

var setDisplayNone = function (item) {
  if (item.textContent === '') {
    item.style.display = 'none';
  }
}

var setDisplayNoneText = function (x, y, tag) {
  if (x === '' || y === '') {
    tag.style.display = 'none';
  }
}

var cardTemplate = document.querySelector('#card').content.querySelector('.popup');

var renderCard = function (item) {
  var card = cardTemplate.cloneNode(true);

  card.querySelector('.popup__title').textContent = item.offer.title;

  card.querySelector('.popup__text--address').textContent = item.offer.address;

  card.querySelector('.popup__text--price').textContent = item.offer.price + ' ₽/ночь';

  setDisplayNoneText(item.offer.price, item.offer.price, card.querySelector('.popup__text--price'));

  if (item.offer.type === 'flat') {
    card.querySelector('.popup__type').textContent = 'Квартира';
  } else if (item.offer.type === 'bungalo') {
    card.querySelector('.popup__type').textContent = 'Бунгало';
  } else if (item.offer.type === 'house') {
    card.querySelector('.popup__type').textContent = 'Дом';
  } else if (item.offer.type === 'palace') {
    card.querySelector('.popup__type').textContent = 'Дворец';
  }

  card.querySelector('.popup__text--capacity').textContent = item.offer.rooms + ' комнаты для ' + item.offer.guests + ' гостей';

  setDisplayNoneText(item.offer.rooms, item.offer.guests, card.querySelector('.popup__text--capacity'));

  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + item.offer.checkin + ', выезд до ' + item.offer.checkout;

  setDisplayNoneText(item.offer.checkin, item.offer.checkout, card.querySelector('.popup__text--time'));

  for (var i = 0; i < item.offer.features.length; i++) {
    var featuresItem = item.offer.features[i];
    var featuresClass = '.popup__feature--' + featuresItem;
    card.querySelector(featuresClass).textContent = featuresItem;
  }

  var featuresArr = card.querySelectorAll('.popup__feature');

  for (var i = 0; i < featuresArr.length; i++) {
    setDisplayNone(featuresArr[i]);
  }

  card.querySelector('.popup__description').textContent = item.offer.description;

  if (item.offer.photos.length == 1) {
    card.querySelector('.popup__photo').src = item.offer.photos;
  } else {
    card.querySelector('.popup__photo').src = item.offer.photos[0];

    for (var i = 1; i < item.offer.photos.length; i++) {
      var photosItem = item.offer.photos[i];
      var newItem = document.createElement('img');
      newItem.src = photosItem;
      newItem.classList.add('popup__photo');
      newItem.width = '45';
      newItem.height = '40';
      newItem.alt = 'Фотография жилья';
      card.querySelector('.popup__photos').appendChild(newItem);
    }
  }

  card.querySelector('.popup__avatar').src = item.author.avatar;

  var cardTags = card.children;

  for (var i = 0; i < cardTags.length; i++) {
    setDisplayNone(cardTags[i]);
  }

  card.style.display = 'none';

  return card;
}

var isClosed = true;

var onPopupEscPress = function (evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closePopup(cardItem);
  }
}

var openPopup = function (cardItem) {
  cardItem.style.display = 'block';

  isClosed = false;

  document.addEventListener('keydown', onPopupEscPress);
}

var closePopup = function (cardItem) {
  cardItem.style.display = 'none';

  isClosed = true;

  document.removeEventListener('keydown', onPopupEscPress);
}

var addOnPinOpen = function (cardItem) {
  pinItem.addEventListener('click', function() {
    if (isClosed) {
      openPopup(cardItem);
    }
  })
}

var addOnCardClose = function (cardItem) {
  cardItem.querySelector('.popup__close').addEventListener('click', function() {
    closePopup(cardItem);
  })
}

var fragmentPin = document.createDocumentFragment();
var fragmentCard = document.createDocumentFragment();

var cards = [];

for (var i = 0; i < flats.length; i++) {
  var cardItem = renderCard(flats[i]);
  fragmentCard.appendChild(cardItem);
  addOnCardClose(cardItem);

  var pinItem = renderPin(flats[i]);
  fragmentPin.appendChild(pinItem);
  addOnPinOpen(cardItem);
}

pinBlock.appendChild(fragmentPin);
map.insertBefore(fragmentCard, mapFiltersBlock);

var cards = map.querySelectorAll('.map__card');

//active and blocked page
var MAINPIN_WIDTH_DEFAULT = 156;
var MAINPIN_WIDTH_ACTIVE = 62;
var MAINPIN_TAIL = 22;

var pins = map.querySelectorAll('button[type="button"]');

var blockPage = function () {
  for (var i = 0; i < pins.length; i++) {
    pins[i].style.display = 'none';
  }

  for (var i = 0; i < fieldsetItems.length; i++) {
    fieldsetItems[i].setAttribute('disabled', 'true');
  }

  propertyAddress.value = (parseInt(mainPin.style.left, 10) + MAINPIN_WIDTH_DEFAULT / 2) + ', ' + (parseInt(mainPin.style.top, 10) + MAINPIN_WIDTH_DEFAULT / 2);
}

var activatePage = function () {
  map.classList.remove('map--faded');

  for (var i = 0; i < pins.length; i++) {
    pins[i].style.display = 'block';
  }

  for (var i = 0; i < fieldsetItems.length; i++) {
    fieldsetItems[i].removeAttribute('disabled');
  }

  propertyAddress.value = (parseInt(mainPin.style.left, 10) + MAINPIN_WIDTH_ACTIVE / 2) + ', ' + (parseInt(mainPin.style.top, 10) + MAINPIN_WIDTH_ACTIVE + MAINPIN_TAIL);
}

blockPage();

mainPin.addEventListener('mousedown', function() {
  if (event.which == 1) {
    activatePage();
  }
})

mainPin.addEventListener('keydown', function(evt) {
  if (evt.key === 'Enter') {
    activatePage();
  }
})

//validation
var MIN_PRICE_BUNGALO = 0;
var MIN_PRICE_FLAT = 1000;
var MIN_PRICE_HOUSE = 5000;
var MIN_PRICE_PALACE = 10000;

var validatePriceType = function () {
  if (propertyType.value === 'bungalo' && propertyPrice.value < MIN_PRICE_BUNGALO) {
    propertyPrice.setCustomValidity('Минимальная цена бунгало за ночь ' + MIN_PRICE_BUNGALO);
  } else if (propertyType.value === 'flat' && propertyPrice.value < MIN_PRICE_FLAT) {
    propertyPrice.setCustomValidity('Минимальная цена квартиры за ночь ' + MIN_PRICE_FLAT);
  } else if (propertyType.value === 'house' && propertyPrice.value < MIN_PRICE_HOUSE) {
    propertyPrice.setCustomValidity('Минимальная цена дома за ночь ' + MIN_PRICE_HOUSE);
  } else if (propertyType.value === 'palace' && propertyPrice.value < MIN_PRICE_PALACE) {
    propertyPrice.setCustomValidity('Минимальная цена дворца за ночь ' + MIN_PRICE_PALACE);
  } else {
    propertyPrice.setCustomValidity('');
  }
}

var validateRoomsCapacity = function () {
  if (propertyRooms.value === '1' && propertyCapacity.value !== '1') {
    propertyCapacity.setCustomValidity('1 комната только для 1 гостя');
  } else if (propertyRooms.value === '2' && (propertyCapacity.value !== '1' || propertyCapacity.value !== '2')) {
    propertyCapacity.setCustomValidity('2 комнаты только для 1 или 2 гостей');
  } else if (propertyRooms.value === '3' && propertyCapacity.value === '0') {
    propertyCapacity.setCustomValidity('3 комнаты только для 1, 2 или 3 гостей');
  } else if (propertyRooms.value === '100' && propertyCapacity.value !== '0') {
    propertyCapacity.setCustomValidity('100 комнат не для гостей');
  } else {
    propertyCapacity.setCustomValidity('');
  }
}

var setPricePlaceholder = function () {
  if (propertyType.value === 'bungalo') {
    propertyPrice.placeholder = '' + MIN_PRICE_BUNGALO;
  } else if (propertyType.value === 'flat') {
    propertyPrice.placeholder = '' + MIN_PRICE_FLAT;
  } else if (propertyType.value === 'house') {
    propertyPrice.placeholder = '' + MIN_PRICE_HOUSE;
  } else if (propertyType.value === 'palace') {
    propertyPrice.placeholder = '' + MIN_PRICE_PALACE;
  }
}

propertyType.addEventListener('input', function () {
  setPricePlaceholder();
  validatePriceType();
})

propertyPrice.addEventListener('input', function () {
  validatePriceType();
})

propertyCheckin.addEventListener('input', function() {
  propertyCheckout.value = propertyCheckin.value;
})

propertyCheckout.addEventListener('input', function() {
  propertyCheckin.value = propertyCheckout.value;
})

propertyRooms.addEventListener('input', function () {
  validateRoomsCapacity();
})

propertyCapacity.addEventListener('input', function () {
  validateRoomsCapacity();
})
