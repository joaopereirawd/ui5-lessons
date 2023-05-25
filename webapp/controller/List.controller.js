sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel"
], function (Controller, ODataModel) {
    "use strict";

    return Controller.extend("seu.namespace.seuController", {
        onInit: function () {
            var sServiceUrl = "URL do serviço OData";
            var oModel = new ODataModel(sServiceUrl);
            this.getView().setModel(oModel, "seuModel");
        }
    });
});