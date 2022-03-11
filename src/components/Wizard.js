import { Badge, Button, ButtonGroup, ButtonToolbar, Modal, Row } from 'react-bootstrap';
import { React, useContext, useMemo, useState } from 'react';

import FilterContext from '../context/FilterContext';
import { useCallback } from 'react';
import Api from '../utils/Api';
import WizardPage from './WizardPage';
import NumberInput from './NumberInput';
import DrawLineChart from './DrawLineChart';
import HelpText from './HelpText';

const VIEW_MODE = {
    WIZARD: "wizard",
    LIST: "list"
}

function Wizard() {

    const { filter, updateFilter, replaceFilter, setShowHelp, showHelp, modelConfig, setRunModel, modelLoading } = useContext(FilterContext)
    const { modelName, title } = modelConfig;
    const [page, setPage] = useState(0)
    const [view, setView] = useState(VIEW_MODE.WIZARD)

    /**
     * Generate parameters
     */
    const parameters = useMemo(function _generateParameters() {

        if (!modelConfig || !modelConfig.parameters) return [];

        return Object.keys(modelConfig.parameters)
            .map(function _forEachParameter(paramName) {
                let {
                    title,
                    label = '',
                    help = '',
                    xRange = [],
                    yRange = [],
                    defaultValue = undefined,
                    min = 0,
                    max = 0,
                    type = 'number'
                } = modelConfig.parameters[paramName];

                if (filter[paramName] && type === "number") {
                    defaultValue = filter[paramName];
                } else if (filter[paramName] &&
                    Array.isArray(filter[paramName].index) &&
                    Array.isArray(filter[paramName].data)
                ) {
                    defaultValue = filter[paramName].index.map((index, ctr) => {
                        return {
                            x: index,
                            y: filter[paramName].data[ctr]
                        }
                    });
                } else {
                    // console.debug(`Failed to find default value for ${paramName} in ${JSON.stringify(filter, null, 2)}`)
                    // console.debug(`No default value for ${paramName} in ${JSON.stringify(Object.keys(filter), null, 2)}`)
                    delete filter[paramName]
                }

                // Process each parameter type and return corresponding control
                switch (type) {
                    case "graph":
                        return (
                            <WizardPage key={`auto-parameter-number-${paramName}`} title={title}>
                                <DrawLineChart
                                    label={label}
                                    parameter={paramName}
                                    defaultData={defaultValue}
                                    xRange={xRange}
                                    yRange={yRange}
                                    updateFilter={updateFilter} />
                                <HelpText>{help}</HelpText>
                            </WizardPage>);
                    case "number":
                    default:
                        return (
                            <WizardPage key={`auto-parameter-chart-${paramName}`} title={title}>
                                <NumberInput
                                    label={label}
                                    parameter={paramName}
                                    defaultValue={+defaultValue}
                                    min={+min}
                                    max={+max}
                                    updateFilter={updateFilter} />
                                <HelpText>{help}</HelpText>
                            </WizardPage>);
                }
            })
    }, [updateFilter, filter, modelConfig]);

    /**
     * Change page
     */
    const changePage = useCallback((currentPage, increment = 1) => {
        if (currentPage <= 0 && increment < 0) return;
        if (currentPage > parameters.length - 1) return;
        setPage(currentPage + increment);
    }, [parameters]);

    /**
     * Load a filter
     */
    const loadFilter = useCallback((scenarioName) => {
        Api.getScenarios(modelName)
            .then(function _handleResponse(res) {
                if (res.data.value[scenarioName]) {
                    replaceFilter(res.data.value[scenarioName]);
                }
            });
    }, [modelName, replaceFilter])

    if (view === VIEW_MODE.LIST) {
        return <div className="wizard-container p-3">
            <h3 className="mb-3">{title}</h3>
            <ButtonToolbar>
                <ButtonGroup className="me-2">
                    <Button size="sm" onClick={() => setView(VIEW_MODE.WIZARD)}>Show wizard</Button>
                </ButtonGroup>
                <ButtonGroup className="me-2">
                    <Button size="sm" onClick={() => setShowHelp(!showHelp)}>{showHelp ? 'Hide help' : 'Show help'}</Button>
                </ButtonGroup>
                <ButtonGroup className="me-2">
                    <Button size="sm" variant="danger" onClick={() => loadFilter("default")}>Reset</Button>
                </ButtonGroup>
            </ButtonToolbar>
            <div className="wizard-page-container">
                {parameters}
            </div>
        </div>
    } else if (view === VIEW_MODE.WIZARD) {
        return <Modal
            show={!modelLoading}
            backdrop="static"
            centered
            size='xl'
            dialogClassName="wizard-modal"
            onHide={() => {
                setView(VIEW_MODE.LIST)
            }}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Badge className="ms-auto" bg="light" text="dark">
                        Step {page + 1} / {parameters.length}
                    </Badge>
                </Row>
                <Row className="wizard-container">
                    {parameters.filter((p, i) => i === page)}
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" disabled={page === 0} onClick={() => changePage(page, -1)}>Previous</Button>
                <Button variant="secondary" disabled={page === parameters.length - 1} onClick={() => changePage(page, 1)}>Next</Button>
                {/* <Button variant="secondary"  onClick={() => onRun(filter)}>Run model</Button> */}
                <Button variant="secondary" onClick={function _onButtonRunModelClick() {
                    setView(VIEW_MODE.LIST);
                    setRunModel(true);
                }}>Run model</Button>
            </Modal.Footer>
        </Modal>
    }
}

export default Wizard;