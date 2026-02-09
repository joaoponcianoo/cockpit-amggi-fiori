/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require(["screentest/test/integration/AllJourneys"
], function () {
	QUnit.start();
});
