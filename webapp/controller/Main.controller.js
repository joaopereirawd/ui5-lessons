sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/webc/fiori/library",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, webcFioriLib, Filter, FilterOperator, MessageToast) {
        "use strict";

        return Controller.extend("client.controller.AsideDetail", {
            onInit: function () {
                var oComponent = this.getOwnerComponent();
                var oRouter = oComponent.getRouter();

                oRouter.getRoute("worklist").attachPatternMatched(this._onObjectMatched, this);

                this.FCLLayout = webcFioriLib.FCLLayout;
            },

            _onObjectMatched: function () {
                this.oModelClients = new JSONModel();
                this.oModelClientZero = new JSONModel();

                this.getClients();
            },

            getClients() {
                var that = this;

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

            handleNewProject() {
                this.dialog = sap.ui.xmlfragment("client.view.fragments.NewClientDialog", this);

                this.getView().addDependent(this.dialog);

                this.dialog.open();

                this.oModelClientSend = new JSONModel();

                this.oModelClientSend.setData({
                    Nomecliente: "",
                    Idcliente: ""
                });

                this.getView().setModel(this.oModelClientSend, "ModelClientSend");
            },

            handleSaveNewProject: function () {
                var that = this;

                var oSendModelData = this.getView().getModel("ModelClientSend").getData();
                var oModel = this.getView().getModel();
                var oEntry = {};

                oEntry.Idcliente = oSendModelData.Idcliente;
                oEntry.Nomecliente = oSendModelData.Nomecliente;
                oEntry.Validodesde = "2023-05-22T00:00:00";
                oEntry.Validoate = "2023-05-22T00:00:00";

                oModel.create("/ClientsSet", oEntry, {
                    success: function (oData) {
                        console.log(oData, 'Dados inseridos com sucesso');
                        that.getClients();
                    },
                    error: function (err) {
                        console.log(err, 'error');
                    }
                });
            },

            handleCloseDialog: function () {
                if (this.dialog) {
                    this.dialog.close();
                }
            },

            handlerDelete() {

                var oModel = this.getView().getModel();

                var oModelDetail = this.getView().getModel('ModelClients').getData();

                var id = oModelDetail.selectedClient.Idcliente;

                var sPath = "/ClientsSet('" + id + "')";

                var that = this;

                oModel.remove(sPath, {
                    success: function (data) {
                        MessageToast.show('Este Cliente foi removido da lista');
                        that.refeshList();

                    },
                    error: function (error) {
                        MessageToast.show("Erro ao excluir o item: " + error.message);
                    }
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
                var oList = this.byId("projects-table");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilters);
            },

            TwoColumnsMidExpanded: function (oEvent) {
                //Properties available ["EndColumnFullScreen", "MidColumnFullScreen", "OneColumn", "ThreeColumnsEndExpanded", "ThreeColumnsMidExpanded", "ThreeColumnsMidExpandedEndHidden", "ThreeColumnsStartExpandedEndHidden", "TwoColumnsMidExpanded", "TwoColumnsStartExpanded"]
                var selectedItemName = oEvent.getSource().getCells()[0].getTitle();

                //var selectedItemName = oEvent.getParameter('listItem').getTitle(); // This works if it is a <List>

                this.getView().byId("fcl").setLayout(this.FCLLayout.TwoColumnsMidExpanded);

                this.oModelClients.setProperty("/selectedClient", this.oModelClients.getData().results.find(function (oItem) {
                    return oItem.Nomecliente === selectedItemName;
                }));
            },
        });
    });
