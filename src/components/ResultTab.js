import React, { useMemo, useCallback, useEffect, useState, useContext } from "react";
import { Spinner, Table, Button, ButtonGroup, ButtonToolbar, Dropdown, DropdownButton, Row, Col, Modal } from "react-bootstrap";
import LineChart from "./LineChart";
import XLSX from 'xlsx';
import axios from "axios";
import FilterContext from "../context/FilterContext";
import PropTypes from 'prop-types';
import Api from "../utils/Api";

function ResultTab({ tabTitle }) {

    const [runModel, setRunModel] = useState(true);
    const [loadedDisplayParameters, setLoadedDisplayParameters] = useState(false);
    const [loading, setLoading] = useState(false);
    const { filter, scenarios, modelConfig, updateDisplayParameters } = useContext(FilterContext);
    const { modelName, visualizations } = modelConfig;
    const [data, setData] = useState([]);
    const [defaultData, setDefaultData] = useState([]);

    // Load model result data
    const reload = useCallback(() => {
        setRunModel(false);
        setLoading(true);
        Api.runModel(modelName, filter)
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error("Error loading model data")
                }
                if (!Array.isArray(response.data) || response.data.length < 1) {
                    throw new Error("No data returned from model");
                }
                setData(response.data)
                if (!loadedDisplayParameters) {
                    updateDisplayParameters(Object.keys(response.data[0]).sort());
                    setLoadedDisplayParameters(true);
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }, [filter, modelName, setRunModel, setLoading, loadedDisplayParameters, updateDisplayParameters, setLoadedDisplayParameters]);

    useEffect(() => {
        if (!runModel) return console.debug("Postponing update until manual model execution");
        reload();
    }, [reload, runModel])

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
    const downloadExcel = useCallback(() => {
        let binaryWS = XLSX.utils.json_to_sheet(data);
        // Create a new Workbook
        var wb = XLSX.utils.book_new()
        // Name your sheet
        XLSX.utils.book_append_sheet(wb, binaryWS, 'Binary values')
        // export your excel
        XLSX.writeFile(wb, `model-data-${new Date().toISOString()}.xlsx`);
    }, [data]);

    // Load results from default scenario
    useEffect(() => {
        if (!scenarios || !scenarios.default) return console.debug("No default scenario available", scenarios);
        setTimeout(() => {
            axios.post(`${process.env.REACT_APP_SDM_API_ENDPOINT}/model/${modelName}`, scenarios.default)
                .then(function (response) {
                    if (response.status !== 200) {
                        throw new Error("Error loading default model scenario")
                    }
                    setDefaultData(response.data)
                })
                .catch((error) => {
                    console.error(error);
                });
        }, 5000)
    }, [scenarios, modelName])

    return (
        <>
            <h3>{tabTitle}</h3>
            <ButtonToolbar>
                <ButtonGroup key="bg-run" className="me-2">
                    <Button size="sm" onClick={() => setRunModel(true)}>Run model</Button>
                </ButtonGroup>
                <ButtonGroup key="bg-scenario" className="me-2">
                    <DropdownButton size="sm" id="dropdown-basic" title="Compare to:">
                        {Object.keys(scenarios).map(scenarioName => (<Dropdown.Item key={`dd-item-${scenarioName}`}>{scenarioName}</Dropdown.Item>))}
                    </DropdownButton>
                </ButtonGroup>
                <ButtonGroup key="bg-download" className="me-2">
                    <Button size="sm" onClick={(event) => downloadExcel(event)}>Download to Excel</Button>
                </ButtonGroup>
            </ButtonToolbar>
            <Modal
                show={loading}
                centered
                backdrop="static"
            >
                <Modal.Header>
                    <Modal.Title>Loading data</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <Spinner animation="border" variant="primary" />
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