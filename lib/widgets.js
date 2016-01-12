'use strict';

var request = require('request');
var Promise = require('bluebird');
var cache = require('memory-cache');
var internal = {};

exports.getExchangeWidget = function(params) {
	var lang = params.lang;
	var country = params.country;
	var key = 'widget-exchange-' + country + lang;

	var result = cache.get(key);

	if (result) {
		return Promise.resolve(result);
	}

	var url = 'http://' + params.host + '/json/widget.json?ul=' + lang;

	return internal.callRequest(key, url);
};

exports.getWeatherWidget = function(params) {
	var lang = params.lang;
	var country = params.country;
	var key = 'widget-weather-' + country + lang;

	var result = cache.get(key);

	if (result) {
		return Promise.resolve(result);
	}

	var url = 'http://' + params.host + '/json/today/' + params.id + '.json?ul=' + lang;

	return internal.callRequest(key, url);
};


internal.callRequest = function(key, url) {
	return internal.request(url).then(function(result) {
		cache.put(key, result, 60 * 15 * 1000);
		return result;
	}).catch(function(error) {
		cache.put(key, {}, 60 * 1000);
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
