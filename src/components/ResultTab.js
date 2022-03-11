import React, { useMemo, useCallback, useEffect, useState, useContext } from "react";
import { Spinner, Table, Button, ButtonGroup, ButtonToolbar, Dropdown, DropdownButton, Row, Col, Modal } from "react-bootstrap";
import LineChart from "./LineChart";
import XLSX from 'xlsx';
import FilterContext from "../context/FilterContext";
import PropTypes from 'prop-types';
import Api from "../utils/Api";

function ResultTab({ tabTitle }) {

    // const [runModel, setRunModel] = useState(true);
    const [loadedDisplayParameters, setLoadedDisplayParameters] = useState(false);
    const { filter, scenarios, modelConfig, updateDisplayParameters, runModel, setRunModel, setModelLoading, modelLoading } = useContext(FilterContext);
    const { modelName, visualizations } = modelConfig;
    const [data, setData] = useState([]);
    const [defaultData, setDefaultData] = useState([]);
    const [compareScenario, setCompareScenario] = useState("default");

    // Load model result data
    const executeModel = useCallback(() => {
        setRunModel(false);
        setModelLoading('Executing model, loading data');
        Api.runModel(modelName, filter)
            .then((response) => {
                if (!Array.isArray(response.data) || response.data.length < 1) {
                    throw new Error("No data returned from model");
                }
                setData(response.data)
                if (!loadedDisplayParameters) {
                    updateDisplayParameters(Object.keys(response.data[0]).sort());
                    setLoadedDisplayParameters(true);
                }
            })
            .catch((error) => {
                // console.error(error);
                console.warn("No saved display parameters");
            })
            .finally(() => {
                setModelLoading(null);
            });
    }, [filter, modelName, setRunModel, setModelLoading, loadedDisplayParameters, updateDisplayParameters, setLoadedDisplayParameters]);

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
                <h4 className="my-3">Result table</h4>
                <Table responsive striped bordered hover className="custom-table">
                    <thead>
                        {headerRow}
                    </thead>
                    <tbody>
                        {resultRows}
                    </tbody>
                </Table>
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

    // Load results from comparison scenario
    const loadCompareScenario = useCallback(function _loadCompareScenario(scenarioName) {
        if (!scenarios || !scenarios[scenarioName] || modelLoading) {
            console.log(scenarios);
            return;
        };
        Api.runModel(modelName, scenarios[scenarioName])
            .then(function _handleResponse(response) {
                setDefaultData(response.data);
            })
            .catch(function _handleError(error) {
                console.error(error);
            });

    }, [scenarios, modelName, modelLoading]);

    /**
     * Updates the current selected scenario name and executes model to retrieve data
     * if different from current scenario name
     */
    const handleSelectCompareScenario = useCallback((scenarioName) => {
        setCompareScenario(prevScenario => {
            if (prevScenario !== scenarioName) {
                loadCompareScenario(scenarioName);
            }
            return scenarioName
        })
    }, [loadCompareScenario]);

    useEffect(() => {
        if (!runModel) return;
        if (defaultData.length === 0 && compareScenario) {
            loadCompareScenario(compareScenario);
        }
        executeModel();
    }, [executeModel, runModel, compareScenario, loadCompareScenario, defaultData])

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
                        {Object.keys(scenarios).map(scenarioName => (
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
                    <p>Patience is a virtue, it is said...</p>
                </Modal.Body>
                {/* <Modal.Footer>
                    <Modal.Title>{modelLoading}</Modal.Title>
                </Modal.Footer> */}
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