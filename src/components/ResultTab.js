import React, { useMemo, useCallback, useEffect, useState, useContext } from "react";
import { Table, Button, ButtonGroup, ButtonToolbar, Dropdown, DropdownButton, Row, Col } from "react-bootstrap";
import LineChart from "./LineChart";
import XLSX from 'xlsx';
import PropTypes from 'prop-types';
import Api from "../utils/Api";
import { CHART_Y_STARTS_AT } from "../config/config";
import ReducerContext from "../context/ReducerContext";
import { setKeyVal } from "../context/ReducerProvider";

export function ResultTab({ tabTitle }) {

    const { state, dispatch } = useContext(ReducerContext);
    const { filter, scenarios, modelConfig, runModel, modelLoading, compareScenario, modelData, modelBaselineData } = state;
    const { modelName, visualizations } = modelConfig;
    const [origo, setOrigo] = useState(CHART_Y_STARTS_AT.DATA);

    // Load model result data
    const executeCurrentScenario = useCallback((modelName) => {
        if (!scenarios || !scenarios["default"] || !modelName || modelLoading) {
            return;
        }
        dispatch({
            type: "runModel"
        })

        let tmpFilter = filter ? filter : scenarios["default"];
        Api.runModel(modelName, tmpFilter)
            .then((response) => {
                if (!Array.isArray(response.data) || response.data.length < 1) {
                    throw new Error("No data returned from model");
                }
                dispatch(setKeyVal("modelData", response.data));
            })
            .catch((error) => {
                console.warn("Error executing model");
            })
            .finally(() => {
                dispatch({
                    type: "modelLoading",
                    payload: false
                })
            });
    }, [filter, modelLoading, scenarios, dispatch]);

    // Load results from comparison scenario
    const executeCompareScenario = useCallback(function _loadCompareScenario(scenarioName) {
        if (!scenarios || !scenarios[scenarioName] || !modelName || modelLoading) {
            return;
        };
        dispatch({
            type: "modelLoading",
            payload: true
        });
        Api.runModel(modelName, scenarios[scenarioName])
            .then(function _handleResponse(response) {
                dispatch(setKeyVal("modelBaselineData", response.data))
            })
            .catch(function _handleError(error) {
                console.error("Error loading compare scenario", error);
            })
            .finally(() => {
                dispatch({
                    type: "modelLoading",
                    payload: false
                })
            });

    }, [scenarios, modelName, modelLoading, dispatch]);

    // Create chart elements for dashboard
    var charts = useMemo(() => {
        if (modelData.length === 0) return null;

        var _charts = [];

        // Loop through variables to be visualized
        for (var dataKey in visualizations) {
            var seriesName = visualizations[dataKey];

            // Create data series
            // eslint-disable-next-line
            var series = modelData.map(row => {
                return { x: row.IDX_TIME, y: row[dataKey] }
            });

            var defaultSeries = [];

            if (modelBaselineData) {
                // eslint-disable-next-line
                var defaultSeries = modelBaselineData.map(row => {
                    return { x: row.IDX_TIME, y: row[dataKey] }
                });
            }

            if ((Array.isArray(series) && !series.some(dp => !dp.y))
                && (Array.isArray(defaultSeries) && !defaultSeries.some(dp => !dp.y))) {
                // Create LineChart element
                _charts.push(
                    <Col key={`chart-col-${new Date().toISOString()}-${_charts.length + 1}`} sm={1} md={6} xxl={4}>
                        <LineChart
                            title={seriesName}
                            data={series}
                            baseline={defaultSeries}
                            origo={origo}
                        />
                    </Col>
                )
            }

        }
        return _charts;
    }, [visualizations, modelData, modelBaselineData, origo])

    // Create table element for dashboard
    const table = useMemo(() => {

        let vizcop = Object.assign({}, visualizations);
        vizcop["IDX_TIME"] = "Model time";

        let colKeys = Object.keys(vizcop).sort();

        let headerRow = (
            <tr>
                {colKeys.map(key => {
                    return (<th key={`data-th-${key}`}>{vizcop[key]}</th>);
                })}
            </tr>
        );

        let resultRows = modelData.filter(row => +row["IDX_TIME"] >= 2020).map((row, rowIdx) => {
            let cols = colKeys.map((colKey, colIdx) => {
                let val = row[colKey];
                if (!isNaN(parseFloat(val))) {
                    val = Math.round(+val * 100) / 100;
                }
                return <td key={`data-td-${rowIdx}-${colIdx}`} xs={1}>{val}</td>
            })
            return (<tr key={`data-tr-${rowIdx}`}>
                {cols}
            </tr>)
        })

        if (modelData.length === 0) return;
        return (
            <Col>
                <div style={{
                    "overflowX": "auto"
                }}>
                    <h4 className="my-3">Result table</h4>
                    <Table striped bordered hover>
                        <thead>
                            {headerRow}
                        </thead>
                        <tbody>
                            {resultRows}
                        </tbody>
                    </Table>
                </div>
            </Col>
        )

    }, [modelData, visualizations])

    // Define function to download table
    const downloadExcel = useCallback((data) => {
        let binaryWS = XLSX.utils.json_to_sheet(data);
        // Create a new Workbook
        var wb = XLSX.utils.book_new()
        // Name your sheet
        XLSX.utils.book_append_sheet(wb, binaryWS, 'Binary values')
        // export your excel
        XLSX.writeFile(wb, `model-data-${new Date().toISOString()}.xlsx`);
    }, []);

    /**
     * Updates the current selected scenario name and executes model to retrieve data
     * if different from current scenario name
     */
    const handleSelectCompareScenario = useCallback((scenarioName) => {
        if (compareScenario !== scenarioName) {
            dispatch(setKeyVal("compareScenario", scenarioName));
            executeCompareScenario(scenarioName);
        }
    }, [executeCompareScenario, compareScenario, dispatch]);

    useEffect(() => {
        if (!runModel || !modelName) return;
        if (modelBaselineData.length === 0) {
            executeCompareScenario(compareScenario || 'default');
        }
        executeCurrentScenario(modelName);
    }, [executeCurrentScenario, modelName, runModel, compareScenario, executeCompareScenario, modelBaselineData])

    return (
        <>
            <h3 className="my-3">{tabTitle}</h3>
            <p>The current scenario is displayed with a red line, the compare scenario is displayed with a blue line</p>
            <ButtonToolbar>
                <ButtonGroup key="bg-run" className="me-2">
                    <Button size="sm" onClick={() => {
                        // setRunModel(true);
                        dispatch(setKeyVal("runModel", true));
                    }}>Run model</Button>
                </ButtonGroup>
                <ButtonGroup key="bg-scenario" className="me-2">
                    <DropdownButton size="sm" id="dropdown-basic" title={`Compare to: ${compareScenario}`}>
                        {scenarios !== null && Object.keys(scenarios).map(scenarioName => (
                            <Dropdown.Item key={`dd-item-${scenarioName}`} onClick={() => handleSelectCompareScenario(scenarioName)}>{scenarioName}</Dropdown.Item>
                        ))}
                    </DropdownButton>
                </ButtonGroup>
                <ButtonGroup key="bg-download" className="me-2">
                    <Button size="sm" onClick={() => downloadExcel(modelData)}>Download to Excel</Button>
                </ButtonGroup>
                {origo === CHART_Y_STARTS_AT.DATA && (
                    <ButtonGroup key="bg-origo" className="me-2">
                        <Button size="sm" onClick={() => setOrigo(CHART_Y_STARTS_AT.ZERO)}>Start Y-axis at zero</Button>
                    </ButtonGroup>
                )}
                {origo === CHART_Y_STARTS_AT.ZERO && (
                    <ButtonGroup key="bg-origo" className="me-2">
                        <Button size="sm" onClick={() => setOrigo(CHART_Y_STARTS_AT.DATA)}>Scale Y-axis to data</Button>
                    </ButtonGroup>
                )}
            </ButtonToolbar>
            <Row>
                {Array.isArray(charts) && charts.length > 0 && (charts)}
            </Row>
            <Row>
                {table && (table)}
            </Row>
        </>
    )
}

ResultTab.propTypes = {
    tabTitle: PropTypes.string.isRequired
}

export default ResultTab;