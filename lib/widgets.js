"use strict";

var request = require("request");
var Promise = require("bluebird");
var internal = {};

exports.getExchangeWidget = function (params, options) {
	var lang = params.lang;

	var url = "http://" + params.host + "/json/widget.json?ul=" + lang;

	return internal.callRequest(url, options);
};

exports.getWeatherWidget = function (params, options) {
	var lang = params.lang;

	var url =
		"http://" + params.host + "/json/today/" + params.id + ".json?ul=" + lang;

	return internal.callRequest(url, options);
};

internal.callRequest = function (url, options) {
	options = options || {};
	options.url = url;
	options.json = true;

	return internal.request(options);
};

internal.request = function (options) {
	return new Promise(function (resolve, reject) {
		request(options, function (error, response, body) {
			if (error) {
				return reject(error);
			}

			resolve(body);
		});
	});
};
