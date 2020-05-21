var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/views/layers/support/FeatureFilter", "esri/views/layers/support/FeatureEffect", "esri/tasks/support/StatisticDefinition", "esri/symbols", "esri/renderers", "./heatmapChart", "esri/widgets/Expand", "./constants"], function (require, exports, EsriMap, MapView, FeatureLayer, FeatureFilter, FeatureEffect, StatisticDefinition, symbols_1, renderers_1, heatmapChart_1, Expand, constants_1) {
    "use strict";
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    (function () { return __awaiter(_this, void 0, void 0, function () {
        function filterByYear(event) {
            var selectedYear = event.target.getAttribute("data-year");
            yearsNodes.forEach(function (node) {
                var year = node.innerText;
                if (year !== selectedYear) {
                    if (node.classList.contains("visible-year")) {
                        node.classList.remove("visible-year");
                    }
                }
                else {
                    if (!node.classList.contains("visible-year")) {
                        node.classList.add("visible-year");
                    }
                }
            });
            layerView.filter = new FeatureFilter({
                where: "Year = '" + selectedYear + "'"
            });
        }
        function resetOnCollapse(expanded) {
            if (!expanded) {
                resetVisuals();
            }
        }
        function eventListener(event) {
            return __awaiter(this, void 0, void 0, function () {
                var hitResponse, hitResults, graphic, geometry, queryOptions, filterOptions, stats;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            event.stopPropagation();
                            return [4 /*yield*/, view.hitTest(event)];
                        case 1:
                            hitResponse = _a.sent();
                            hitResults = hitResponse.results.filter(function (hit) { return hit.graphic.layer === countiesLayer; });
                            if (!(hitResults.length > 0)) return [3 /*break*/, 3];
                            graphic = hitResults[0].graphic;
                            if (!(previousId !== graphic.attributes.FID)) return [3 /*break*/, 3];
                            previousId = graphic.attributes.FID;
                            if (highlight) {
                                highlight.remove();
                                highlight = null;
                            }
                            highlight = countiesLayerView.highlight([previousId]);
                            geometry = graphic && graphic.geometry;
                            queryOptions = {
                                geometry: geometry,
                                spatialRelationship: "intersects"
                            };
                            filterOptions = new FeatureFilter(queryOptions);
                            layerView.effect = new FeatureEffect({
                                filter: filterOptions,
                                excludedEffect: "grayscale(90%) opacity(15%)"
                            });
                            return [4 /*yield*/, queryTimeStatistics(layerView, queryOptions)];
                        case 2:
                            stats = _a.sent();
                            heatmapChart_1.updateGrid(stats);
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
        function queryTimeStatistics(layerView, params) {
            return __awaiter(this, void 0, void 0, function () {
                var geometry, distance, units, query, queryResponse, responseChartData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            geometry = params.geometry, distance = params.distance, units = params.units;
                            query = layerView.layer.createQuery();
                            query.outStatistics = [
                                new StatisticDefinition({
                                    onStatisticField: "Total_visits",
                                    outStatisticFieldName: "value",
                                    statisticType: "sum"
                                })
                            ];
                            query.groupByFieldsForStatistics = ["YEAR + '-' + MonthName"];
                            query.geometry = geometry;
                            query.distance = distance;
                            query.units = units;
                            query.returnQueryGeometry = true;
                            return [4 /*yield*/, layerView.queryFeatures(query)];
                        case 1:
                            queryResponse = _a.sent();
                            responseChartData = queryResponse.features.map(function (feature) {
                                var timeSpan = feature.attributes["EXPR_1"].split("-");
                                var year = timeSpan[0];
                                var month = timeSpan[1];
                                return {
                                    month: month,
                                    year: year,
                                    value: feature.attributes.value
                                };
                            });
                            return [2 /*return*/, createDataObjects(responseChartData)];
                    }
                });
            });
        }
        function queryLayerStatistics(layer) {
            return __awaiter(this, void 0, void 0, function () {
                var query, queryResponse, responseChartData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            query = layer.createQuery();
                            query.outStatistics = [
                                new StatisticDefinition({
                                    onStatisticField: "Total_visits",
                                    outStatisticFieldName: "value",
                                    statisticType: "sum"
                                })
                            ];
                            query.groupByFieldsForStatistics = ["YEAR + '-' + MonthName"];
                            return [4 /*yield*/, layer.queryFeatures(query)];
                        case 1:
                            queryResponse = _a.sent();
                            responseChartData = queryResponse.features.map(function (feature) {
                                var timeSpan = feature.attributes["EXPR_1"].split("-");
                                var year = timeSpan[0];
                                var month = timeSpan[1];
                                return {
                                    month: month,
                                    year: year,
                                    value: feature.attributes.value
                                };
                            });
                            return [2 /*return*/, createDataObjects(responseChartData)];
                    }
                });
            });
        }
        function createDataObjects(data) {
            var formattedChartData = [];
            constants_1.months.forEach(function (month, s) {
                constants_1.years.forEach(function (year, t) {
                    var matches = data.filter(function (datum) {
                        return datum.year === year && datum.month === month;
                    });
                    formattedChartData.push({
                        col: t,
                        row: s,
                        value: matches.length > 0 ? matches[0].value : 0
                    });
                });
            });
            return formattedChartData;
        }
        function resetVisuals() {
            layerView.filter = null;
            layerView.effect = null;
            if (highlight) {
                highlight.remove();
                highlight = null;
            }
            yearsNodes.forEach(function (node) {
                node.classList.add("visible-year");
            });
            heatmapChart_1.updateGrid(layerStats, layerView, true);
        }
        var layer, countiesLayer, map, view, yearsElement, chartExpand, yearsExpand, layerView, countiesLayerView, layerStats, yearsNodes, highlight, previousId, resetBtn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    layer = new FeatureLayer({
                        portalItem: {
                            id: "3a8aae65f6d64c9dacce3049ebe32f0c"
                        },
                        outFields: ["MonthName", "YEAR"]
                    });
                    countiesLayer = new FeatureLayer({
                        title: "counties",
                        portalItem: {
                            id: "3a8aae65f6d64c9dacce3049ebe32f0c"
                        },
                        popupTemplate: null,
                        opacity: 0,
                        renderer: new renderers_1.SimpleRenderer({
                            symbol: new symbols_1.SimpleFillSymbol({
                                color: [0, 0, 0, 1],
                                outline: null
                            })
                        })
                    });
                    map = new EsriMap({
                        basemap: "gray-vector",
                        layers: [layer, countiesLayer]
                    });
                    view = new MapView({
                        map: map,
                        container: "viewDiv",
                        center: [-85, 50],
                        zoom: 4,
                        highlightOptions: {
                            color: "#262626",
                            haloOpacity: 1,
                            fillOpacity: 0
                        }
                    });
                    return [4 /*yield*/, view.when()];
                case 1:
                    _a.sent();
                    yearsElement = document.getElementById("years-filter");
                    yearsElement.style.visibility = "visible";
                    chartExpand = new Expand({
                        view: view,
                        content: document.getElementById("chartDiv"),
                        expandIconClass: "esri-icon-chart",
                        group: "top-left"
                    });
                    yearsExpand = new Expand({
                        view: view,
                        content: yearsElement,
                        expandIconClass: "esri-icon-filter",
                        group: "top-left"
                    });
                    view.ui.add(yearsExpand, "top-left");
                    view.ui.add(chartExpand, "top-left");
                    view.ui.add("titleDiv", "top-right");
                    return [4 /*yield*/, view.whenLayerView(layer)];
                case 2:
                    layerView = _a.sent();
                    return [4 /*yield*/, view.whenLayerView(countiesLayer)];
                case 3:
                    countiesLayerView = _a.sent();
                    return [4 /*yield*/, queryLayerStatistics(layer)];
                case 4:
                    layerStats = _a.sent();
                    heatmapChart_1.updateGrid(layerStats, layerView);
                    yearsElement.addEventListener("click", filterByYear);
                    yearsNodes = document.querySelectorAll(".year-item");
                    yearsExpand.watch("expanded", resetOnCollapse);
                    chartExpand.watch("expanded", resetOnCollapse);
                    highlight = null;
                    view.on("drag", ["Control"], eventListener);
                    view.on("click", ["Control"], eventListener);
                    resetBtn = document.getElementById("resetBtn");
                    resetBtn.addEventListener("click", resetVisuals);
                    return [2 /*return*/];
            }
        });
    }); })();
});
//# sourceMappingURL=main.js.map
