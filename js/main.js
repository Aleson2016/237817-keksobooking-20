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

var getRandomNumber = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var getMixedArray = function(min, max) {
  var comments = [];

  while(comments.length < max) {
    var el = getRandomNumber(min, max);
    if (comments.indexOf(el) == -1) {
      comments.push(el);
    }
  }
  return comments;
}

var getRandomArray = function(arr) {
  var items = [];

  items.length = getRandomNumber(MIN_NUMBER, arr.length);

  for(var i = 0; i < items.length; i++) {
    items[i] = arr[i];
  }
  return items;
}

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

document.querySelector('.map').classList.remove('map--faded');

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

var renderPin = function(item) {
  var pin = pinTemplate.cloneNode(true);
  pin.style.left = item.location.x + 'px';
  pin.style.top = item.location.y + 'px';

  pin.querySelector('img').src = item.author.avatar;

  return pin;
}

var fragment = document.createDocumentFragment();

for(var i = 0; i < flats.length; i++) {
  fragment.appendChild(renderPin(flats[i]));
}

var pinBlock = document.querySelector('.map__pins');

pinBlock.appendChild(fragment);

var setDisplayNone = function(item) {
  if (item.textContent === '') {
    item.style.display = 'none';
  }
}

var setDisplayNoneText = function(x, y, tag) {
  if (x === '' || y === '') {
    tag.style.display = 'none';
  }
}

var cardTemplate = document.querySelector('#card').content.querySelector('.popup');

var renderCard = function(item) {
  var card = cardTemplate.cloneNode(true);

  card.querySelector('.popup__title').textContent = item.offer.title;

  card.querySelector('.popup__text--address').textContent = item.offer.address;

  card.querySelector('.popup__text--price').textContent = item.offer.price + ' ₽/ночь';

  setDisplayNoneText(item.offer.price, item.offer.price, card.querySelector('.popup__text--price'));

  if (item.offer.type == 'flat') {
    card.querySelector('.popup__type').textContent = 'Квартира';
  } else if (item.offer.type == 'bungalo') {
    card.querySelector('.popup__type').textContent = 'Бунгало';
  } else if (item.offer.type == 'house') {
    card.querySelector('.popup__type').textContent = 'Дом';
  } else if (item.offer.type == 'palace') {
    card.querySelector('.popup__type').textContent = 'Дворец';
  }

  card.querySelector('.popup__text--capacity').textContent = item.offer.rooms + ' комнаты для ' + item.offer.guests + ' гостей';
  var z = '.popup__text--capacity';

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

  return card;
}

var fragmentCard = document.createDocumentFragment();

for (var i = 0; i < flats.length; i++) {
  fragmentCard.appendChild(renderCard(flats[i]));
}

var mapBlock = document.querySelector('.map');

var mapFiltersBlock = mapBlock.querySelector('.map__filters-container');

mapBlock.insertBefore(fragmentCard, mapFiltersBlock);
