'use strict';

(function () {
  var UPLOAD_URL = 'https://javascript.pages.academy/keksobooking';
  var DOWNLOAD_URL = 'https://javascript.pages.academy/keksobooking/data';
  var TYPE_GET = 'GET';
  var TYPE_POST = 'POST';

  window.backend = {
    upload: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad(xhr.response);
        } else {
          onError(xhr.status, xhr.statusText);
        }
      });

      xhr.open(TYPE_POST, UPLOAD_URL);

      xhr.send(data);
    },

    download: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad(xhr.response);
        } else {
          onError('Статус ответа' + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        onError('Ошибка соединения');
      });

      xhr.open(TYPE_GET, DOWNLOAD_URL);
      xhr.send();
    },

    onError: function (message) {
      var node = document.createElement('div');
      node.style = 'z-index: 100; margin: 0 auto; padding: 10px; text-align: center; background-color: red;';
      node.style.position = 'absolute';
      node.style.left = 0;
      node.style.right = 0;
      node.style.fontSize = '30px';

      node.textContent = message;
      document.body.insertAdjacentElement('afterbegin', node);
    }
  };
})();
