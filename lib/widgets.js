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

	var url = 'http://' + params.host + '/json/widget.json?ul=' + lang;

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

	var url = 'http://' + params.host + '/json/today/' + params.id + '.json?ul=' + lang;

	return internal.callRequest(key, url);
};


internal.callRequest = function(key, url) {
	return internal.request(url).then(function(result) {
		cache.set(key, result);
		return result;
	}).catch(function(error) {
		cache.set(key, {}, {
			ttl: 60
		});
		return Promise.reject(error);
	});
};

internal.request = function(url) {
	return new Promise(function(resolve, reject) {
		request({
			url: url,
			timeout: 1000 * 2,
			json: true
		}, function(error, response, body) {
			if (error) {
				return reject(error);
			}
			if (!body) {
				return reject(new Error('Body is empty'));
			}

			resolve(body);
		});
	});
};
