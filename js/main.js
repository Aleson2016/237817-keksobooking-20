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

var getRandomArray = function(min, max) {
  var comments = [];

  while(comments.length < max) {
    var el = getRandomNumber(min, max);
    if (comments.indexOf(el) == -1) {
      comments.push(el);
    }
  }
  return comments;
}

var render = function(arr) {
  var items = [];

  items.length = getRandomNumber(MIN_NUMBER, arr.length);

  for(var i = 0; i < items.length; i++) {
    items[i] = arr[i];
  }
  return items;
}

var flats = [];
var avatars = getRandomArray(MIN_NUMBER, MAX_NUMBER);
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
      'price': MAX_NUMBER,
      'type': flatTypes[getRandomNumber(0, flatTypes.length - 1)],
      'rooms': MAX_NUMBER,
      'guests': MAX_NUMBER,
      'checkin': checkTimes[getRandomNumber(0, checkTimes.length - 1)],
      'checkout': checkTimes[getRandomNumber(0, checkTimes.length - 1)],
      'features': render(features),
      'description': '',
      'photos': render(photos),
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
