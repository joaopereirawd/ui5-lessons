sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("client.controller.Detail", {
            onInit: function () {
                console.log('Im inside new view');
            },
            goBack() {
                let oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("worklist");
            }
        });
    });
