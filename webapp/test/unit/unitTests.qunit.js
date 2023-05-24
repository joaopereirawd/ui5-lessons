/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"client/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
