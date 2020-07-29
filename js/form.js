'use strict';

(function () {
  var minPrice = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };

  var form = document.querySelector('.ad-form');

  var avatarUploadFieldset = form.querySelector('.ad-form-header');

  var avatarUpload = avatarUploadFieldset.querySelector('#avatar');

  var photosUploadFieldset = form.querySelector('.ad-form__photo');

  var photosUpload = form.querySelector('#images');

  var propertyType = form.querySelector('#type');

  var propertyPrice = form.querySelector('#price');

  var propertyCheckin = form.querySelector('#timein');

  var propertyCheckout = form.querySelector('#timeout');

  var propertyRooms = form.querySelector('#room_number');

  var propertyCapacity = form.querySelector('#capacity');

  var resetButton = form.querySelector('.ad-form__reset');

  var successTemplate = document.querySelector('#success').content.querySelector('.success');

  var errorTemplate = document.querySelector('#error').content.querySelector('.error');

  var main = document.querySelector('main');

  var validatePriceType = function () {
    if (propertyType.value === 'bungalo' && propertyPrice.value < minPrice.BUNGALO) {
      propertyPrice.setCustomValidity('Минимальная цена бунгало за ночь ' + minPrice.BUNGALO);
    } else if (propertyType.value === 'flat' && propertyPrice.value < minPrice.FLAT) {
      propertyPrice.setCustomValidity('Минимальная цена квартиры за ночь ' + minPrice.FLAT);
    } else if (propertyType.value === 'house' && propertyPrice.value < minPrice.HOUSE) {
      propertyPrice.setCustomValidity('Минимальная цена дома за ночь ' + minPrice.HOUSE);
    } else if (propertyType.value === 'palace' && propertyPrice.value < minPrice.PALACE) {
      propertyPrice.setCustomValidity('Минимальная цена дворца за ночь ' + minPrice.PALACE);
    } else {
      propertyPrice.setCustomValidity('');
    }
  };

  var validateRoomsCapacity = function () {
    if (propertyRooms.value === '1' && propertyCapacity.value !== '1') {
      propertyCapacity.setCustomValidity('1 комната только для 1 гостя');
    } else if (propertyRooms.value === '2' && propertyCapacity.value === '0') {
      propertyCapacity.setCustomValidity('2 комнаты только для 1 или 2 гостей');
    } else if (propertyRooms.value === '2' && propertyCapacity.value === '3') {
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
      propertyPrice.placeholder = '' + minPrice.BUNGALO;
    } else if (propertyType.value === 'flat') {
      propertyPrice.placeholder = '' + minPrice.FLAT;
    } else if (propertyType.value === 'house') {
      propertyPrice.placeholder = '' + minPrice.HOUSE;
    } else if (propertyType.value === 'palace') {
      propertyPrice.placeholder = '' + minPrice.PALACE;
    }
  };

  var getDefaultForm = function () {
    form.reset();
  };

  var successMessageItem = successTemplate.cloneNode(true);
  successMessageItem.style.display = 'none';
  main.appendChild(successMessageItem);

  var successMessage = main.querySelector('.success');

  var errorMessageItem = errorTemplate.cloneNode(true);
  errorMessageItem.style.display = 'none';
  main.appendChild(errorMessageItem);

  var errorMessage = main.querySelector('.error');

  var errorMessageClose = main.querySelector('.error__button');

  var onEscPress = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();

      successMessage.style.display = 'none';

      document.removeEventListener('keydown', onEscPress);
      document.removeEventListener('click', onPageClick);
    }
  };

  var onPageClick = function (evt) {
    evt.preventDefault();

    successMessage.style.display = 'none';

    document.removeEventListener('click', onPageClick);
    document.removeEventListener('keydown', onEscPress);
  };

  var onErrorCloseClick = function (evt) {
    evt.preventDefault();

    errorMessage.style.display = 'none';

    errorMessageClose.removeEventListener('click', onErrorCloseClick);
    document.removeEventListener('click', onErrorPageClick);
  };

  var onErrorPageClick = function (evt) {
    evt.preventDefault();

    errorMessage.style.display = 'none';

    document.removeEventListener('click', onErrorPageClick);
    errorMessageClose.removeEventListener('click', onErrorCloseClick);
  };

  var onSuccess = function () {
    getDefaultForm();
    window.main.blockPage();

    window.main.mainPin.addEventListener('mousedown', window.main.onMainPinClick);

    window.main.mainPin.addEventListener('keydown', window.main.onEnterPress);

    successMessage.style.display = 'block';

    document.addEventListener('keydown', onEscPress);

    document.addEventListener('click', onPageClick);
  };

  var onError = function () {
    errorMessage.style.display = 'block';

    errorMessageClose.addEventListener('click', onErrorCloseClick);
    document.addEventListener('click', onErrorPageClick);
  };

  avatarUpload.addEventListener('change', function () {
    var previewPhoto = avatarUploadFieldset.querySelector('img');
    var file = avatarUpload.files[0];
    var reader = new FileReader();

    reader.onload = function () {
      var dataURL = reader.result;
      previewPhoto.src = dataURL;
    };

    reader.readAsDataURL(file);
  });

  form.addEventListener('input', function (evt) {
    validateRoomsCapacity();

    if (evt.target.id === 'type') {
      setPricePlaceholder();
      validatePriceType();
    }

    if (evt.target.id === 'price') {
      validatePriceType();
    }

    if (evt.target.id === 'timein') {
      propertyCheckout.value = propertyCheckin.value;
    }

    if (evt.target.id === 'timeout') {
      propertyCheckin.value = propertyCheckout.value;
    }
  });

  photosUpload.addEventListener('change', function () {
    var previewPhoto = document.createElement('img');
    previewPhoto.width = '70';
    previewPhoto.height = '70';
    previewPhoto.alt = 'Фотография жилья';
    photosUploadFieldset.style.display = 'flex';
    photosUploadFieldset.style.flexWrap = 'wrap';
    photosUploadFieldset.style.flexGrow = '1';

    photosUploadFieldset.appendChild(previewPhoto);

    var file = photosUpload.files[0];
    var reader = new FileReader();

    reader.onload = function () {
      var dataURL = reader.result;
      previewPhoto.src = dataURL;
    };

    reader.readAsDataURL(file);
  });

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();

    window.backend.upload(new FormData(form), onSuccess, onError);
  });

  resetButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    getDefaultForm();

    window.main.blockPage();

    window.main.mainPin.addEventListener('mousedown', window.main.onMainPinClick);

    window.main.mainPin.addEventListener('keydown', window.main.onEnterPress);
  });
})();
