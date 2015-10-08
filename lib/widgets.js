'use strict';

var core = require('ournet.core');
var request = require('request');
var Promise = core.Promise;
var cache = new core.MemoryCache({
  ttl: 60 * 15
});
var extern = module.exports;
var internal = {};

extern.getExchangeWidget = function(params) {
  var lang = params.lang,
    country = params.country,
    key = 'exchange-' + country + lang;

  var result = cache.get(key);

  if (result) {
    return Promise.resolve(result);
  }

  var cw = core.constants.portal.exchange,
    url = 'http://' + cw.hosts[country] + '/json/widget.json?ul=' + lang;

  return internal.callRequest(key, url);
};

extern.getWeatherWidget = function(params) {
  var lang = params.lang,
    country = params.country,
    key = 'weather-' + country + lang;

  var result = cache.get(key);

  if (result) {
    return Promise.resolve(result);
  }

  var cw = core.constants.portal.weather,
    url = 'http://' + cw.hosts[country] + '/json/today/' + cw.capitals[country] + '.json?ul=' + lang;

  return internal.callRequest(key, url);
};


internal.callRequest = function(key, url) {
  return internal.request(url).then(function(result) {
    cache.set(key, result);
    return result;
  }).catch(function(error) {
    core.logger.error(error.message);
    cache.set(key, {}, {
      ttl: 60
    });
    return {};
  });
};

internal.request = function(url) {
  return new Promise(function(resolve, reject) {
    request({
      url: url,
      timeout: 1000 * 2
    }, function(error, response, body) {
      if (error) {
        return reject(error);
      }
      if (!body) {
        return reject(new Error('Body is empty'));
      }
      try {
        body = JSON.parse(body);
      } catch (e) {
        return reject(e);
      }
      if (!body) {
        return reject(new Error('Body is not JSON valid'));
      }

      resolve(body);
    });
  });
};
