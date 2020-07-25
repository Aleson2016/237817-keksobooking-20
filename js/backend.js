'use strict';

(function () {
  // var UPLOAD_URL = 'https://javascript.pages.academy/keksobooking';
  var DOWNLOAD_URL = 'https://javascript.pages.academy/keksobooking/data';
  var TYPE_GET = 'GET';
  var TYPE_POST = 'POST';

  var sendRequest = function (url, type, data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError(xhr.status, xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError(xhr.status, xhr.statusText);
    });

    xhr.open(type, url);

    if (data) {
      xhr.send(data);
    } else {
      xhr.send();
    }
  };

  window.backend = {
    upload: function (data, onLoad, onError) {
      sendRequest(UPLOAD_URL, TYPE_POST, data, onLoad, onError);
    },

    download: function (onLoad, onError) {
      sendRequest(DOWNLOAD_URL, TYPE_GET, undefined, onLoad, onError);
    },

    onError: function (message) {
      console.error(message);

      // var node = document.createElement('div');
      // node.style = 'z-index: 100; margin: 0 auto; padding: 10px; text-align: center; background-color: red;';
      // node.style.position = 'absolute';
      // node.style.left = 0;
      // node.style.right = 0;
      // node.style.fontSize = '30px';
      //
      // node.textContent = message;
      // document.body.insertAdjacentElement('afterbegin', node);
    }
  };
})();
