'use strict';

(function () {

  var isClosed = true;

  var onPopupEscPress = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
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

})();
