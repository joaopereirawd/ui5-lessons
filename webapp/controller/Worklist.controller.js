sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("client.controller.Worklist", {
            onInit: function () {
                var oComponent = this.getOwnerComponent();
                var oRouter = oComponent.getRouter();

                oRouter.getRoute("worklist").attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function () {
                this._getClients();
            },

            _getClients() {
                var that = this;

                that.oModelClients = new JSONModel();

                var oModel = this.getView().getModel();

                oModel.read("/ClientsSet", {
                    success: function (oData) {
                        that.oModelClients.setData(oData);
                        that.getView().setModel(that.oModelClients, "ModelClients")
                        console.log(that.oModelClients, 'oData');

                    }, error: function (oData) { console.log(oData) }
                });
            },

            onPress: function () {
                //debugger;

                sap.m.MessageToast.show("This message should appear in the message toast", {
                    duration: 3000,                  // default
                    width: "15em",                   // default
                    my: "center center",             // default
                    at: "center center",             // default
                    of: window,                      // default
                    offset: "0 0",                   // default
                    collision: "fit fit",            // default
                    onClose: null,                   // default
                    autoClose: true,                 // default
                    animationTimingFunction: "ease", // default
                    animationDuration: 1000,         // default
                    closeOnBrowserNavigation: true   // default
                });
            }
        });
    });
