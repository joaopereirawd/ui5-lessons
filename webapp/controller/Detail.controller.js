sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter) {
        "use strict";

        return Controller.extend("client.controller.Detail", {
            onInit: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("detail").attachPatternMatched(this._onRouteMatched, this);
            },

            _onRouteMatched: function (oEvent) {
                this.readHandler(oEvent);
            },

            readHandler(oEvent) {
                var that = this;

                var sClientId = parseInt(oEvent.getParameter("arguments").clientID);

                var oModel = this.getView().getModel();

                var sPath = "/ClientsSet('" + sClientId + "')";

                oModel.read(sPath, {
                    success: function (oData) {
                        var oClient = oData;

                        that.oModelClient = new JSONModel(oClient);

                        that.getView().setModel(that.oModelClient, "detail");

                    }.bind(this),
                    error: function (error) {
                        console.error("Erro ao ler os dados do cliente:", error);
                    }
                });

            },

            deleteHandler() {
                var oModel = this.getView().getModel();

                var oModelDetail = this.getView().getModel('detail').getData();

                var id = oModelDetail.Idcliente;

                var sPath = "/ClientsSet('" + id + "')";

                oModel.remove(sPath, {
                    success: function (data) {
                        console.log(data, "Item excluído com sucesso");
                    },
                    error: function (error) {
                        console.log("Erro ao excluir o item: " + error.message);
                    }
                });
            },

            goBack() {
                let oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("worklist");
            }
        });
    });
