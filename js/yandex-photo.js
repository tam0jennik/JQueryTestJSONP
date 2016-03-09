$(document).ready(function() {
  $(".image").yandexPhoto("showPhotoDay");
  $(".show").yandexPhoto("showSlideshow");
});

function getImgFromYandex(urlToYandex, size, callback) {
  var imgSizes = ['L', 'M', 'S', 'XL', 'XS', 'XXL', 'XXS', 'XXXS', 'orig'];
  if (imgSizes.some(function(element) {
      return element == size;
    })) {
    $.ajax({
      type: 'GET',
      url: urlToYandex,
      dataType: 'jsonp',
      success: function(json) {
        var urls = json.entries.map(function(items) {
          return items.img[size].href;
        });
        callback(urls);
      },
      error: function() {
        console.log('ajax error in yandex loader plugin');
      }
    });
  } else {
    return "Error size params";
  }
}

function updateImg(url, node) {
  node.attr('src', url);
}

function drawImg(imgUrl) {
  $(".image").attr('src', imgUrl);
}

var methods = {
  showPhotoDay: function(options) {
    var settings = $.extend({
      date: function() {
        var TIME_CONST = 'T12:00:00';
        var re = /T\d+:\d+:\d+.\d+/;
        var defaultDate = new Date();
        var dateISO = defaultDate.toISOString();
        return dateISO.replace(re, TIME_CONST);
      },
      size: 'XXL'
    }, options);

    var urlToYandex = 'http://api-fotki.yandex.ru/api/podhistory/poddate;' + settings.date() + '/?limit=1;format=json&callback=eatme/';
    var img = $(this);
    var url = getImgFromYandex(urlToYandex, settings.size, function(urls) {
      img.attr('src', urls[0]);
    });
  },
  showSlideshow: function(options) {
    var settings = $.extend({
      delay: 5000,
      size: "XXL",
    }, options);
    var urlToYandex = 'http://api-fotki.yandex.ru/api/top/?format=json&callback=eatme';
    var img = $(this);
    getImgFromYandex(urlToYandex, settings.size, function(urls) {
      var i = 0;
      var timerId = setInterval(function() {
        updateImg(urls[i++], img);
        if (i >= urls.length) {
          clearInterval(timerId);
        }
      }, settings.delay);
    });
  }
};


$.fn.yandexPhoto = function(method) {
  if (methods[method]) {
    return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
  } else if (typeof method === 'object' || !method) {
    return methods.init.apply(this, arguments);
  } else {
    $.error('Method ' + method + ' not found for jQuery.yandexPhoto');
  }
};
