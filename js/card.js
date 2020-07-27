'use strict';

(function () {
  var setDisplayNone = function (item) {
    if (item.textContent === '') {
      item.style.display = 'none';
    }
  };

  var setDisplayNoneText = function (x, y, tag) {
    if (x === '' || y === '') {
      tag.style.display = 'none';
    }
  };

  var cardTemplate = document.querySelector('#card').content.querySelector('.popup');

  window.card.renderCard = function (item) {
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

    for (var j = 0; j < item.offer.features.length; j++) {
      var featuresItem = item.offer.features[j];
      var featuresClass = '.popup__feature--' + featuresItem;
      card.querySelector(featuresClass).textContent = featuresItem;
    }

    var featuresArr = card.querySelectorAll('.popup__feature');

    for (var k = 0; k < featuresArr.length; k++) {
      setDisplayNone(featuresArr[k]);
    }

    card.querySelector('.popup__description').textContent = item.offer.description;

    if (item.offer.photos.length < 1) {
      card.querySelector('.popup__photo').style.display = 'none';
    } else if (item.offer.photos.length === 1) {
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

    for (var a = 0; a < cardTags.length; a++) {
      setDisplayNone(cardTags[a]);
    }

    card.style.display = 'none';

    return card;
  };
})();
