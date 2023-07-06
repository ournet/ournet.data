"use strict";

var widgets = require("../lib/widgets");

describe("widgets", function () {
	it("#getExchangeWidget", function () {
		return widgets.getExchangeWidget({
			lang: "ro",
			country: "ro",
			host: "curs.ournet.ro",
		});
	});

	it("#getWeatherWidget", function () {
		return widgets.getWeatherWidget({
			lang: "ro",
			country: "ro",
			host: "meteo.ournet.ro",
			id: 683508,
		});
	});
});
