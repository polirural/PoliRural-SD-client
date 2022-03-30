import { Badge, Button, Modal, Row, Stack } from 'react-bootstrap';
import { React, useMemo, useContext, useState } from 'react';

import { useCallback } from 'react';
import Api from '../utils/Api';
import WizardPage from './WizardPage';
import NumberInput from './NumberInput';
import DrawLineChart from './DrawLineChart';
import HelpText from './HelpText';
import { VIEW_MODE } from '../config/config';
import { createObjectKeySort } from '../utils/Object';
import ReducerContext from '../context/ReducerContext';
import { setKeyVal } from '../context/ReducerProvider';

function Wizard() {

    const { state, dispatch } = useContext(ReducerContext);

    const {
        filter,
        showHelp,
        modelConfig,
        modelLoading,
        inputParameterMode,
        modelName
    } = state

    const {
        title
    } = modelConfig;

    const [page, setPage] = useState(0);

    const onChange = useCallback((event) => {
        console.log(event);
        if (!event) return;
        dispatch({
            type: "updateFilter",
            payload: {
                key: event.target.name,
                val: event.target.value
            }
        })
    }, [dispatch]);

    /**
     * Generate parameters
     */
    const parameters = useMemo(function _generateParameters() {

        if (!modelConfig || !modelConfig.parameters || filter === null) return [];

        return Object.keys(modelConfig.parameters)
            .sort(createObjectKeySort(modelConfig.parameters))
            .map(function _forEachParameter(paramName) {
                let {
                    title,
                    label = '',
                    help = '',
                    min = 0,
                    max = 0,
                    tmin = 2022,
                    tmax = 2040,
                    type = 'number'
                } = modelConfig.parameters[paramName];

                // Process each parameter type and return corresponding control
                switch (type) {
                    case "graph":
                        return (
                            <WizardPage key={`auto-parameter-number-${paramName}`} title={title}>
                                <DrawLineChart
                                    label={label}
                                    name={paramName}
                                    value={filter[paramName]}
                                    xRange={[+tmin, +tmax]}
                                    yRange={[+min, +max]}
                                    onChange={onChange}
                                />
                                <HelpText>{help}</HelpText>
                            </WizardPage>);
                    case "number":
                    default:
                        return (
                            <WizardPage key={`auto-parameter-chart-${paramName}`} title={title}>
                                <NumberInput
                                    label={label}
                                    name={paramName}
                                    value={+filter[paramName]}
                                    min={+min}
                                    max={+max}
                                    onChange={onChange} />
                                <HelpText>{help}</HelpText>
                            </WizardPage>);
                }
            })
    }, [filter, modelConfig, onChange]);

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
                    dispatch({
                        type: "loadFilterRunModel",
                        payload: res.data.value[scenarioName]
                    });
                }
            });
    }, [modelName, dispatch])

    if (inputParameterMode === VIEW_MODE.LIST) {
        return <div className="wizard-container p-3">
            <h3 className="mb-3">{title}</h3>
            <Stack gap={2} direction="horizontal">
                <Button size="sm" onClick={() => {
                    dispatch(setKeyVal("inputParameterMode", VIEW_MODE.WIZARD));
                }}>Show wizard</Button>
                <Button size="sm" onClick={() => {
                    dispatch(setKeyVal("showHelp", !showHelp))
                }}>{showHelp ? 'Hide help' : 'Show help'}</Button>
                <Button size="sm" onClick={() => {
                    loadFilter("default");
                }}>Load defaults</Button>
            </Stack>
            <div className="wizard-page-container">
                {parameters}
            </div>
        </div>
    } else if (inputParameterMode === VIEW_MODE.WIZARD) {
        return <Modal
            show={!modelLoading}
            backdrop="static"
            centered
            size='xl'
            dialogClassName="wizard-modal"
            onHide={() => {
                dispatch(setKeyVal("inputParameterMode", VIEW_MODE.LIST));
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
                <Button variant="secondary" onClick={function _onButtonRunModelClick() {
                    dispatch({
                        type: "closeWizardRun"
                    });
                }}>Run model</Button>
            </Modal.Footer>
        </Modal>
    }
}

export default Wizard;