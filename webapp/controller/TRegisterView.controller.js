sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "jquery.sap.global",
    "sap/m/MessageToast"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, jQuery, MessageToast) {
		"use strict";

		return Controller.extend("trainingregister.controller.TRegisterView", {
			onInit: function () {
                this.oComp = this.getOwnerComponent();

                sap.ui.getCore().attachValidationError(function(evt) {
                    var control = evt.getParameter("element");
                    if (control && control.setValueState) {
                        control.setValueState("Error");
                    }
                });
                sap.ui.getCore().attachValidationSuccess(function(evt) {
                    var control = evt.getParameter("element");
                    if (control && control.setValueState) {
                        control.setValueState("None");
                    }
                });

                this.initRegistrationDataModel();
                this.initResourceBundle();
            },
            

            initResourceBundle: function() {
                var oI18nAppModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                this.oBundle = oI18nAppModel;
            },

            initRegistrationDataModel: function() {
                var registrationDataModel = new sap.ui.model.json.JSONModel();
                registrationDataModel.setData({
                    postData: {
                        candidateFirstName: "",
                        candidateLastName: "",
                        mail: ""
                    }, callback: {
                        displayMessage: false,
                        status: "None",
                        msg: "",
                        showFields: true
                    },
                    requestSent: true
                });
                this.getView().setModel(registrationDataModel, "registrationDataModel");
            },

            isValidate: function() {
                var isValid = true;
                var inputs = [
                    this.byId("partner-registeration-form-firstnameInput"),
                    this.byId("partner-registeration-form-lastnameInput"),
                    this.byId("partner-registeration-form-emailInput")
                ];

                // check that inputs are not empty
                // this does not happen during data binding as this is only triggered by changes
                jQuery.each(inputs, function(i, input) {
                    if (!input.getValue()) {
                        input.setValueState("Error");
                    }
                });
                jQuery.each(inputs, function(i, input) {
                    if (input.getValueState() === "Error") {
                        isValid = false;
                        return false;
                    }
                });
                return isValid;
            },
            
            register: function(oEvent) {

                if (!this.isValidate()) {
                    return;
                }

                var view = this.getView();
                var m = view.getModel("registrationDataModel");
                var registrationData = m.getData();
                var candidateFirstName = registrationData.postData.candidateFirstName;
                var candidateLastName = registrationData.postData.candidateLastName;
                var mail = registrationData.postData.mail;

                var inviteUrl = "/ias/cps/invite/";
                
                var siteUrl = "https://69c77e7atrial.cpp.cfapps.eu10.hana.ondemand.com/site?siteId=b68895ea-a4d1-4585-9b32-b5ba4e7c31f5";

                var data = {
                    "inviteeEmail": mail,
                    "inviteeFirstName": candidateFirstName,
                    "inviteeLastName": candidateLastName,
                    "inviterName": candidateFirstName,
                    "footerText":  siteUrl // can be replace with email template
                };

                jQuery.ajax({
                    async: true,
                    url: inviteUrl,
                    type: "post",
                    data: JSON.stringify(data),
                    contentType: "application/json;charset=utf-8",
                    dataType: "text",
                    success: function(data, res) {
                        
                        var message = this.oBundle.getText("SUCCESS_MESSAGE") || "Success!";
                        MessageToast.show(message, {duration: 2000});
                    }.bind(this),
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        MessageToast.show("Failed with " + textStatus, {duration: 3000});
                    }.bind(this)
                });
            },

            typeEMail: sap.ui.model.SimpleType.extend("email", {
                formatValue: function(oValue) {
                    return oValue;
                },
                parseValue: function(oValue) {
                    //parsing step takes place before validating step, value can be altered
                    return oValue;
                },
                validateValue: function(oValue) {
                    // The following Regex is NOT a completely correct one and only used for demonstration purposes.
                    // RFC 5322 cannot even checked by a Regex and the Regex for RFC 822 is very long and complex.
                    var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
                    if (!oValue.match(mailregex)) {
                        throw new sap.ui.model.ValidateException("'" + oValue + "' is not a valid email address");
                    }
                }
            })

        });
	});
