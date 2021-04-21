/*global QUnit*/

sap.ui.define([
	"training_register/controller/TRegisterView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("TRegisterView Controller");

	QUnit.test("I should test the TRegisterView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
