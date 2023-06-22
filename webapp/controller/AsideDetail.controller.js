sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/webc/fiori/library",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, webcFioriLib, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("client.controller.AsideDetail", {
            onInit: function () {
                var oComponent = this.getOwnerComponent();
                var oRouter = oComponent.getRouter();

                oRouter.getRoute("worklist").attachPatternMatched(this._onObjectMatched, this);

                this.FCLLayout = webcFioriLib.FCLLayout;
            },

            _onObjectMatched: function () {
                this.getClients();
            },

            getClients() {
                var that = this;

                that.oModelClients = new JSONModel();
                that.oModelClientZero = new JSONModel();

                var oModel = this.getView().getModel();

                oModel.read("/ClientsSet", {
                    success: function (oData) {
                        that.oModelClients.setData(oData);

                        that.getView().setModel(that.oModelClients, "ModelClients")
                        //console.log(that.oModelClients, 'oData');

                        that.oModelClientZero.setData(oData.results[0])
                        that.getView().setModel(that.oModelClientZero, "ModelClientZero")

                    }, error: function (error) { that._errorMessages(error) }
                });
            },

            onLiveSearch: function (oEvent) {
                // add filter for search
                var aFilters = [];
                var sQuery = oEvent.getSource().getValue();

                if (sQuery && sQuery.length > 0) {
                    var filter = new Filter("Nomecliente", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);
                }

                // update list binding
                var oList = this.byId("list");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilters);
            },

            onClickHandler: function (oEvent) {
                var selectedItemName = oEvent.getSource().getCells()[0].getTitle();
                //var selectedItemName = oEvent.getParameter('listItem').getTitle(); // This works if it is a <List> insted <Table>

                this.getView().byId("fcl").setLayout(this.FCLLayout.TwoColumnsMidExpanded);

                this.oModelClients.setProperty("/selectedClient", this.oModelClients.getData().results.find(function (oItem) {
                    return oItem.Nomecliente === selectedItemName;
                }));

                console.log(this.oModelClients.getData());

            },
        });
    });
