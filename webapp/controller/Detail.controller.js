sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    "sap/ui/webc/fiori/library",
    "sap/m/MessageToast",

], function (Controller, JSONModel, webcFioriLib, MessageToast) {
    "use strict";
    return Controller.extend("client.controller.Detail", {
        onInit: function () {
            this.FCLLayout = webcFioriLib.FCLLayout;
            this.oModelClients = new JSONModel();
            this.oModelClientZero = new JSONModel();
        },

        deleteHandler() {
            var that = this;

            var oModel = this.getView().getModel();

            var oModelDetail = this.getView().getModel('ModelClients').getData();

            var id = oModelDetail.selectedClient.Idcliente;

            var sPath = "/ClientsSet('" + id + "')";

            oModel.remove(sPath, {
                success: function (data) {
                    MessageToast.show('Este Cliente foi removido da lista');
                    that.setOneColumn();

                },
                error: function (error) {
                    MessageToast.show("Erro ao excluir o item: " + error.message);
                }
            });
        },

        setOneColumn() {
            var oFCL = this.getView().getParent().getParent();
            oFCL.setLayout(this.FCLLayout.OneColumn);

            this.refreshData();
        },

        refreshData() {
            console.log('lets refresh');

            var that = this;
            var oModel = this.getView().getModel();

            oModel.read("/ClientsSet", {
                success: function (oData) {
                    that.oModelClients.setData(oData);

                    that.getView().setModel(that.oModelClients, "ModelClients")
                    //console.log(that.oModelClients, 'oData');

                }, error: function (error) { that._errorMessages(error) }
            });
        }
    });
});