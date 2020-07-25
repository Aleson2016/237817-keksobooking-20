'use strict';

(function () {
  var MIN_PRICE_BUNGALO = 0;
  var MIN_PRICE_FLAT = 1000;
  var MIN_PRICE_HOUSE = 5000;
  var MIN_PRICE_PALACE = 10000;

  var form = document.querySelector('.ad-form');

  var propertyAddress = form.querySelector('#address');

  var propertyType = form.querySelector('#type');

  var propertyPrice = form.querySelector('#price');

  var propertyCheckin = form.querySelector('#timein');

  var propertyCheckout = form.querySelector('#timeout');

  var propertyRooms = form.querySelector('#room_number');

  var propertyCapacity = form.querySelector('#capacity');

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
  };

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
  };

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
  };

  propertyType.addEventListener('input', function () {
    setPricePlaceholder();
    validatePriceType();
  });

  propertyPrice.addEventListener('input', function () {
    validatePriceType();
  });

  propertyCheckin.addEventListener('input', function () {
    propertyCheckout.value = propertyCheckin.value;
  });

  propertyCheckout.addEventListener('input', function () {
    propertyCheckin.value = propertyCheckout.value;
  });

  propertyRooms.addEventListener('input', function () {
    validateRoomsCapacity();
  });

  propertyCapacity.addEventListener('input', function () {
    validateRoomsCapacity();
  });
})();
