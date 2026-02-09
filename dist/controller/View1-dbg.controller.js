sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
  ],
  function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("screentest.controller.View1", {
      onInit: function () {
        // Criar modelo com dados mockados
        var oData = {
          results: [
            {
              barcaca: "BAR-001",
              cte: "35240612345678901234567890123456789012",
              nfe: "35240698765432109876543210987654321098",
              material: "SOJA EM GRÃOS",
              pesoBruto: 5420.5,
              pesoLiquido: 5380.0,
              dataChegada: new Date(2024, 1, 15),
              statusCCT: "Disponível",
            },
            {
              barcaca: "BAR-002",
              cte: "35240612345678901234567890123456789013",
              nfe: "35240698765432109876543210987654321099",
              material: "MILHO",
              pesoBruto: 4850.75,
              pesoLiquido: 4820.3,
              dataChegada: new Date(2024, 1, 15),
              statusCCT: "Processado",
            },
            {
              barcaca: "BAR-003",
              cte: "35240612345678901234567890123456789014",
              nfe: "35240698765432109876543210987654321100",
              material: "FARELO DE SOJA",
              pesoBruto: 6200.0,
              pesoLiquido: 6150.25,
              dataChegada: new Date(2024, 1, 16),
              statusCCT: "Pendente",
            },
            {
              barcaca: "BAR-001",
              cte: "35240612345678901234567890123456789015",
              nfe: "35240698765432109876543210987654321101",
              material: "SOJA EM GRÃOS",
              pesoBruto: 5100.8,
              pesoLiquido: 5065.4,
              dataChegada: new Date(2024, 1, 16),
              statusCCT: "Disponível",
            },
            {
              barcaca: "BAR-004",
              cte: "35240612345678901234567890123456789016",
              nfe: "35240698765432109876543210987654321102",
              material: "TRIGO",
              pesoBruto: 4320.6,
              pesoLiquido: 4290.15,
              dataChegada: new Date(2024, 1, 17),
              statusCCT: "Cancelado",
            },
            {
              barcaca: "BAR-005",
              cte: "35240612345678901234567890123456789017",
              nfe: "35240698765432109876543210987654321103",
              material: "AÇÚCAR",
              pesoBruto: 7890.45,
              pesoLiquido: 7850.9,
              dataChegada: new Date(2024, 1, 17),
              statusCCT: "Disponível",
            },
            {
              barcaca: "BAR-002",
              cte: "35240612345678901234567890123456789018",
              nfe: "35240698765432109876543210987654321104",
              material: "MILHO",
              pesoBruto: 5670.3,
              pesoLiquido: 5640.75,
              dataChegada: new Date(2024, 1, 18),
              statusCCT: "Processado",
            },
            {
              barcaca: "BAR-006",
              cte: "35240612345678901234567890123456789019",
              nfe: "35240698765432109876543210987654321105",
              material: "CAFÉ",
              pesoBruto: 3450.2,
              pesoLiquido: 3425.8,
              dataChegada: new Date(2024, 1, 18),
              statusCCT: "Pendente",
            },
            {
              barcaca: "BAR-007",
              cte: "35240612345678901234567890123456789020",
              nfe: "35240698765432109876543210987654321106",
              material: "ARROZ",
              pesoBruto: 6780.9,
              pesoLiquido: 6745.55,
              dataChegada: new Date(2024, 1, 19),
              statusCCT: "Disponível",
            },
            {
              barcaca: "BAR-003",
              cte: "35240612345678901234567890123456789021",
              nfe: "35240698765432109876543210987654321107",
              material: "FARELO DE SOJA",
              pesoBruto: 5920.65,
              pesoLiquido: 5885.2,
              dataChegada: new Date(2024, 1, 19),
              statusCCT: "Processado",
            },
            {
              barcaca: "BAR-008",
              cte: "35240612345678901234567890123456789022",
              nfe: "35240698765432109876543210987654321108",
              material: "FERTILIZANTE",
              pesoBruto: 8450.35,
              pesoLiquido: 8400.7,
              dataChegada: new Date(2024, 1, 20),
              statusCCT: "Disponível",
            },
            {
              barcaca: "BAR-009",
              cte: "35240612345678901234567890123456789023",
              nfe: "35240698765432109876543210987654321109",
              material: "CALCÁRIO",
              pesoBruto: 9230.15,
              pesoLiquido: 6180.45,
              dataChegada: new Date(2024, 1, 20),
              statusCCT: "Pendente",
            },
          ],
        };

        var oModel = new JSONModel(oData);
        this.getView().setModel(oModel);

        // Preparar dados para os gráficos e resumo
        this._updatePanelCharts();
      },

      _updatePanelCharts: function () {
        var oModel = this.getView().getModel();
        var aResults = oModel.getProperty("/results");

        // Dados para o gráfico de pizza (Status CCT)
        var oStatusCount = {};
        aResults.forEach(function (item) {
          if (!oStatusCount[item.statusCCT]) {
            oStatusCount[item.statusCCT] = 0;
          }
          oStatusCount[item.statusCCT]++;
        });

        // Ordenar para garantir consistência de cores
        var aOrdemStatus = [
          "Disponível",
          "Processado",
          "Pendente",
          "Cancelado",
        ];
        var aStatusData = [];
        aOrdemStatus.forEach(function (status) {
          if (oStatusCount[status]) {
            aStatusData.push({
              status: status,
              quantidade: oStatusCount[status],
            });
          }
        });

        // Dados para o gráfico de colunas (Peso Bruto vs Líquido)
        var oPesosData = {
          pesoBrutoTotal: 0,
          pesoLiquidoTotal: 0,
          diferenca: 0,
        };

        aResults.forEach(function (item) {
          oPesosData.pesoBrutoTotal += item.pesoBruto;
          oPesosData.pesoLiquidoTotal += item.pesoLiquido;
        });

        oPesosData.diferenca =
          oPesosData.pesoBrutoTotal - oPesosData.pesoLiquidoTotal;

        var aPesosChartData = [
          {
            tipo: "Peso Bruto",
            valor: Math.round(oPesosData.pesoBrutoTotal * 100) / 100,
          },
          {
            tipo: "Peso Líquido",
            valor: Math.round(oPesosData.pesoLiquidoTotal * 100) / 100,
          },
          {
            tipo: "Diferença (Tara)",
            valor: Math.round(oPesosData.diferenca * 100) / 100,
          },
        ];

        // Calcular dados do Resumo Geral
        var oResumo = {
          totalCargas: aResults.length,
          pesoBrutoTotal:
            Math.round((oPesosData.pesoBrutoTotal / 1000) * 100) / 100, // Converter para toneladas
          pesoLiquidoTotal:
            Math.round((oPesosData.pesoLiquidoTotal / 1000) * 100) / 100, // Converter para toneladas
          divergenciaMedia:
            Math.round(
              (oPesosData.diferenca / oPesosData.pesoBrutoTotal) * 100 * 100,
            ) / 100, // Calcular % média
        };

        // Atualizar modelo com dados dos gráficos e resumo
        oModel.setProperty("/statusChartData", aStatusData);
        oModel.setProperty("/pesosChartData", aPesosChartData);
        oModel.setProperty("/resumo", oResumo);

        // Configurar cores do gráfico após atualizar os dados
        var that = this;
        setTimeout(function () {
          that._configureChartColors();
        }, 100);
      },

      _configureChartColors: function () {
        var oVizFrame = this.byId("chartStatusCCT");

        // Cores SAP Fiori que correspondem aos estados
        var aColors = {
          Disponível: "#107e3e", // Success (verde)
          Processado: "#0a6ed1", // Information (azul)
          Pendente: "#e9730c", // Warning (laranja)
          Cancelado: "#bb0000", // Error (vermelho)
        };

        var oModel = this.getView().getModel();
        var aStatusData = oModel.getProperty("/statusChartData");
        var aPalette = [];

        aStatusData.forEach(function (item) {
          aPalette.push(aColors[item.status] || "#5899da");
        });

        oVizFrame.setVizProperties({
          plotArea: {
            colorPalette: aPalette,
            dataLabel: {
              visible: true,
              type: "percentage",
              formatString: "0.0%",
            },
          },
          legend: {
            title: {
              visible: false,
            },
          },
          title: {
            visible: false,
          },
        });
      },

      onNavBack: function () {
        MessageToast.show("Voltar pressionado");
      },

      onValueHelp: function () {
        MessageToast.show("Value Help pressionado");
      },

      onSearchViagem: function () {
        MessageToast.show("Buscar Viagem pressionado");
      },

      onDisponibilizar: function () {
        var oTable = this.byId("tableResults");
        var aSelectedItems = oTable.getSelectedItems();

        if (aSelectedItems.length === 0) {
          MessageToast.show("Selecione ao menos um item");
          return;
        }

        MessageToast.show(
          aSelectedItems.length + " item(ns) disponibilizado(s) para CCT",
        );
      },

      onRemover: function () {
        var oTable = this.byId("tableResults");
        var aSelectedItems = oTable.getSelectedItems();

        if (aSelectedItems.length === 0) {
          MessageToast.show("Selecione ao menos um item");
          return;
        }

        MessageToast.show(
          aSelectedItems.length + " item(ns) removido(s) do CCT",
        );
      },

      onDataSaida: function () {
        var oDatePicker = this.byId("dataSaidaComboio");
        oDatePicker.setEnabled(!oDatePicker.getEnabled());
        MessageToast.show(
          "Data Saída " +
            (oDatePicker.getEnabled() ? "habilitada" : "desabilitada"),
        );
      },

      onExport: function () {
        MessageToast.show("Exportando para Excel...");
      },

      onRefresh: function () {
        MessageToast.show("Dados atualizados");
        // Atualizar gráficos e resumo
        this._updatePanelCharts();
      },

      onViewDetails: function (oEvent) {
        var oItem = oEvent.getSource().getParent().getParent();
        var oContext = oItem.getBindingContext();
        var oData = oContext.getObject();

        // Preparar dados para os gráficos
        var oChartData = {
          barcaca: oData.barcaca,
          cte: oData.cte,
          nfe: oData.nfe,
          material: oData.material,
          pesoBruto: oData.pesoBruto,
          pesoLiquido: oData.pesoLiquido,
          dataChegada: oData.dataChegada,
          statusCCT: oData.statusCCT,

          // Dados para gráfico de comparação de pesos
          pesosData: [
            { tipo: "Peso Bruto", valor: oData.pesoBruto },
            { tipo: "Peso Líquido", valor: oData.pesoLiquido },
            { tipo: "Diferença", valor: oData.pesoBruto - oData.pesoLiquido },
          ],

          // Dados para gráfico de distribuição (pizza)
          distribuicaoData: [
            { categoria: "Peso Líquido", valor: oData.pesoLiquido },
            { categoria: "Tara", valor: oData.pesoBruto - oData.pesoLiquido },
          ],

          // Dados para histórico da barcaça (simulado)
          historicoData: this._getHistoricoDaBarcaca(oData.barcaca),

          // Dados para comparação com outras barcaças
          comparacaoData: this._getComparacaoBarcacas(oData.barcaca),
        };

        // Criar modelo para o dialog
        var oChartModel = new JSONModel(oChartData);
        this.getView().setModel(oChartModel, "chartData");

        // Abrir dialog
        if (!this._oChartDialog) {
          this._oChartDialog = this.byId("chartDialog");
        }
        this._oChartDialog.open();
      },

      _getHistoricoDaBarcaca: function (sBarcaca) {
        // Simular histórico de 5 viagens da barcaça
        var aHistorico = [];
        var oModel = this.getView().getModel();
        var aAllData = oModel.getProperty("/results");

        // Filtrar viagens da mesma barcaça
        var aBarcacaData = aAllData.filter(function (item) {
          return item.barcaca === sBarcaca;
        });

        // Se tiver menos de 5, criar dados simulados
        for (var i = 0; i < Math.max(5, aBarcacaData.length); i++) {
          if (aBarcacaData[i]) {
            var oDate = new Date(aBarcacaData[i].dataChegada);
            aHistorico.push({
              data: oDate.getDate() + "/" + (oDate.getMonth() + 1),
              pesoBruto: aBarcacaData[i].pesoBruto,
              pesoLiquido: aBarcacaData[i].pesoLiquido,
            });
          } else {
            // Dados simulados
            aHistorico.push({
              data: 15 - i + "/02",
              pesoBruto: 5000 + Math.random() * 2000,
              pesoLiquido: 4950 + Math.random() * 1900,
            });
          }
        }

        return aHistorico;
      },

      _getComparacaoBarcacas: function (sBarcacaAtual) {
        var oModel = this.getView().getModel();
        var aAllData = oModel.getProperty("/results");
        var oBarcacas = {};

        // Agrupar por barcaça e calcular média
        aAllData.forEach(function (item) {
          if (!oBarcacas[item.barcaca]) {
            oBarcacas[item.barcaca] = {
              barcaca: item.barcaca,
              pesoBruto: 0,
              pesoLiquido: 0,
              count: 0,
            };
          }
          oBarcacas[item.barcaca].pesoBruto += item.pesoBruto;
          oBarcacas[item.barcaca].pesoLiquido += item.pesoLiquido;
          oBarcacas[item.barcaca].count++;
        });

        // Calcular média e converter para array
        var aComparacao = [];
        for (var key in oBarcacas) {
          var oBarcaca = oBarcacas[key];
          aComparacao.push({
            barcaca: oBarcaca.barcaca,
            pesoBruto:
              Math.round((oBarcaca.pesoBruto / oBarcaca.count) * 100) / 100,
            pesoLiquido:
              Math.round((oBarcaca.pesoLiquido / oBarcaca.count) * 100) / 100,
          });
        }

        // Ordenar para destacar a barcaça atual
        aComparacao.sort(function (a, b) {
          if (a.barcaca === sBarcacaAtual) return -1;
          if (b.barcaca === sBarcacaAtual) return 1;
          return a.barcaca.localeCompare(b.barcaca);
        });

        return aComparacao;
      },

      onCloseChartDialog: function () {
        this._oChartDialog.close();
      },

      onEdit: function (oEvent) {
        var oItem = oEvent.getSource().getParent().getParent();
        var oContext = oItem.getBindingContext();
        var oData = oContext.getObject();

        MessageToast.show("Editar: " + oData.cte);
      },

      formatter: {
        formatStatusState: function (sStatus) {
          switch (sStatus) {
            case "Disponível":
              return "Success";
            case "Processado":
              return "Information";
            case "Pendente":
              return "Warning";
            case "Cancelado":
              return "Error";
            default:
              return "None";
          }
        },
      },
    });
  },
);
