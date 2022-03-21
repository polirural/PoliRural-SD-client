import React, { useMemo, useCallback, useEffect, useState, useContext } from "react";
import { Spinner, Table, Button, ButtonGroup, ButtonToolbar, Dropdown, DropdownButton, Row, Col, Modal } from "react-bootstrap";
import LineChart from "./LineChart";
import XLSX from 'xlsx';
import FilterContext from "../context/FilterContext";
import PropTypes from 'prop-types';
import Api from "../utils/Api";

export function ResultTab({ tabTitle }) {

    // const [runModel, setRunModel] = useState(true);
    const [loadedDisplayParameters, setLoadedDisplayParameters] = useState(false);
    const { filter, scenarios, modelConfig, setDisplayParameters, runModel, setRunModel, setModelLoading, modelLoading, compareScenario, setCompareScenario } = useContext(FilterContext);
    const { modelName, visualizations } = modelConfig;
    const [data, setData] = useState([]);
    const [defaultData, setDefaultData] = useState([]);

    // Load model result data
    const executeCurrentScenario = useCallback((modelName) => {
        if (!scenarios || !scenarios["default"] || !modelName || modelLoading) {
            return;
        }
        setRunModel(false);
        setModelLoading(true);

        let tmpFilter = filter ? filter : scenarios["default"];
        Api.runModel(modelName, tmpFilter)
            .then((response) => {
                // console.log("Executing current", filter);
                if (!Array.isArray(response.data) || response.data.length < 1) {
                    throw new Error("No data returned from model");
                }
                setData(response.data)
                if (!loadedDisplayParameters) {
                    setDisplayParameters(Object.keys(response.data[0]).sort());
                    setLoadedDisplayParameters(true);
                }
            })
            .catch((error) => {
                console.warn("No saved display parameters");
            })
            .finally(() => {
                setModelLoading(false);
            });
    }, [filter, setRunModel, setModelLoading, loadedDisplayParameters, setDisplayParameters, setLoadedDisplayParameters, modelLoading, scenarios]);

    // Load results from comparison scenario
    const executeCompareScenario = useCallback(function _loadCompareScenario(scenarioName) {
        if (!scenarios || !scenarios[scenarioName] || !modelName || modelLoading) {
            return;
        };
        Api.runModel(modelName, scenarios[scenarioName])
            .then(function _handleResponse(response) {
                // console.log("Executing compare", scenarios[scenarioName])
                setDefaultData(response.data);
            })
            .catch(function _handleError(error) {
                console.error("Error loading compare scenario", error);
            });

    }, [scenarios, modelName, modelLoading]);
    // Create chart elements for dashboard
    var charts = useMemo(() => {
        if (data.length === 0) return null;

        var _charts = [];

        // Loop through variables to be visualized
        for (var dataKey in visualizations) {
            var seriesName = visualizations[dataKey];

            // Create data series
            // eslint-disable-next-line
            var series = data.map(row => {
                return { x: row.IDX_TIME, y: row[dataKey] }
            });

            var defaultSeries = [];

            if (defaultData) {
                // eslint-disable-next-line
                var defaultSeries = defaultData.map(row => {
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
                        />
                    </Col>
                )
            }

        }
        return _charts;
    }, [visualizations, data, defaultData])

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

        let resultRows = data.map((row, rowIdx) => {
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

        if (data.length === 0) return;
        return (
            <Col>
                <div style={{
                    "height": "90vh",
                    "overflowY": "auto",
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

    }, [data, visualizations])

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
        setCompareScenario(prevScenario => {
            if (prevScenario !== scenarioName) {
                executeCompareScenario(scenarioName);
            }
            return scenarioName
        })
    }, [executeCompareScenario, setCompareScenario]);

    useEffect(() => {
        if (!runModel || !modelName) return;
        if (defaultData.length === 0) {
            executeCompareScenario(compareScenario || 'default');
        }
        executeCurrentScenario(modelName);
    }, [executeCurrentScenario, modelName, runModel, compareScenario, executeCompareScenario, defaultData])

    // Reset data, comparison and run model when changing to a new model
    useEffect(() => {
        setData([]);
        setDefaultData([]);
        return () => {
            setData([]);
            setDefaultData([]);
        }
    }, [modelName]);

    return (
        <>
            <h3 className="my-3">{tabTitle}</h3>
            <p>The current scenario is displayed with a red line, the compare scenario is displayed with a blue line</p>
            <ButtonToolbar>
                <ButtonGroup key="bg-run" className="me-2">
                    <Button size="sm" onClick={() => setRunModel(true)}>Run model</Button>
                </ButtonGroup>
                <ButtonGroup key="bg-scenario" className="me-2">
                    <DropdownButton size="sm" id="dropdown-basic" title={`Compare to: ${compareScenario}`}>
                        {scenarios !== null && Object.keys(scenarios).map(scenarioName => (
                            <Dropdown.Item key={`dd-item-${scenarioName}`} onClick={() => handleSelectCompareScenario(scenarioName)}>{scenarioName}</Dropdown.Item>
                        ))}
                    </DropdownButton>
                </ButtonGroup>
                <ButtonGroup key="bg-download" className="me-2">
                    <Button size="sm" onClick={() => downloadExcel(data)}>Download to Excel</Button>
                </ButtonGroup>
            </ButtonToolbar>
            <Modal
                show={modelLoading}
                centered
                backdrop="static"
            >
                <Modal.Body className="text-center">
                    <Spinner animation="border" variant="primary" className="mt-5" />
                    <h4 className="my-5">{modelLoading}</h4>
                    <p>Trees that are slow to grow bear the best fruit.</p>
                </Modal.Body>
            </Modal>
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