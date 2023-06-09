sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageToast, Filter, FilterOperator) {
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

            _errorMessages(error) {
                MessageToast.show(error.message, {
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
            },

            generalMessages: function (msg) {
                //debugger;

                MessageToast.show(msg, {
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
            },

            onPressNovoCliente: function () {
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

            onCloseDialog: function () {
                if (this.dialog) {
                    this.dialog.close();
                }
            },

            onSaveClient: function () {
                var oSendModelData = this.getView().getModel("ModelClientSend").getData();
                var oModel = this.getView().getModel();
                var oEntry = {};

                oEntry.Idcliente = oSendModelData.Idcliente;
                oEntry.Nomecliente = oSendModelData.Nomecliente;
                oEntry.Validodesde = "2023-05-22T00:00:00";
                oEntry.Validoate = "2023-05-22T00:00:00";

                oModel.create("/ClientsSet", oEntry, null, {
                    success: function (oData) {
                        console.log(oData, 'Success');
                    },
                    error: function (err) {
                        console.log(err, 'error');
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

                    console.log(aFilters);
                }

                // update list binding
                var oList = this.byId("list");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilters);
            },

            onItemPress(oEvent) {
                // Obtém o item pressionado
                var oSelectedItem = oEvent.getSource();

                // Obtém o caminho do item selecionado para obter os dados correspondentes
                var sPath = oSelectedItem.getBindingContextPath();
                //console.log(sPath);

                // Obtém o modelo de dados atual
                var oModel = oSelectedItem.getModel("ModelClients");

                // Obtém os dados do item selecionado com base no caminho
                var oSelectedData = oModel.getProperty(sPath);

                // Navega para a página de detalhes e passa os dados selecionados
                this.getOwnerComponent().getRouter().navTo("detail", {
                    clientID: oSelectedData.Idcliente // Supondo que o objeto de dados tenha uma propriedade chamada Idcliente
                });
            },
        });
    });
