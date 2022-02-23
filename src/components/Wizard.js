import { Badge, Button, ButtonGroup, ButtonToolbar, Modal, Row } from 'react-bootstrap';
import { React, useContext, useState } from 'react';

import FilterContext from '../context/FilterContext';
import { PropTypes } from 'prop-types';
import { useCallback } from 'react';
import Api from '../utils/Api';

const viewMode = {
    wizard: "wizard",
    list: "list"
}

function Wizard({ title, children, onRun }) {

    const { replaceFilter, setShowHelp, showHelp, modelConfig, setRunModel, modelLoading } = useContext(FilterContext)
    const { modelName } = modelConfig;
    const [page, setPage] = useState(0)
    const [view, setView] = useState(viewMode.wizard)

    const changePage = useCallback((currentPage, increment = 1) => {
        if (currentPage <= 0 && increment < 0) return;
        if (currentPage > children.length - 1) return;
        setPage(currentPage + increment);
    }, [children]);

    const loadFilter = useCallback((scenarioName) => {
        Api.getScenarios(modelName)
            .then(function _handleResponse(res) {
                if (res.data.value[scenarioName]) {
                    console.debug("Replacing filter", res.data.value[scenarioName])
                    replaceFilter(res.data.value[scenarioName]);
                }
            });
    }, [modelName, replaceFilter])
    
    if (view === viewMode.list) {
        return <div className="wizard-container p-3">
            <h3 className="mb-3">{title}</h3>
            <ButtonToolbar>
                <ButtonGroup className="me-2">
                    <Button size="sm" onClick={() => setView(viewMode.wizard)}>Show wizard</Button>
                </ButtonGroup>
                <ButtonGroup className="me-2">
                    <Button size="sm" onClick={() => setShowHelp(!showHelp)}>{showHelp ? 'Hide help' : 'Show help'}</Button>
                </ButtonGroup>
                <ButtonGroup className="me-2">
                    <Button size="sm" variant="danger" onClick={() => loadFilter("default")}>Reset</Button>
                </ButtonGroup>
            </ButtonToolbar>
            <div className="wizard-page-container">
                {children}
            </div>
        </div>
    } else if (view === viewMode.wizard) {
        return <Modal
            show={!modelLoading}
            backdrop="static"
            centered
            size='xl'
            dialogClassName="wizard-modal"
            onHide={() => {
                setView(viewMode.list)
            }}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Badge className="ms-auto" bg="light" text="dark">
                        Step {page + 1} / {children.length}
                    </Badge>
                </Row>
                <Row className="wizard-container">
                    {children.filter((p, i) => i === page)}
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" disabled={page === 0} onClick={() => changePage(page, -1)}>Previous</Button>
                <Button variant="secondary" disabled={page === children.length - 1} onClick={() => changePage(page, 1)}>Next</Button>
                {/* <Button variant="secondary"  onClick={() => onRun(filter)}>Run model</Button> */}
                <Button variant="secondary" disabled={!(page === children.length - 1)} onClick={function _onButtonRunModelClick() {
                    setView(viewMode.list);
                    setRunModel(true);
                }}>Run model</Button>
            </Modal.Footer>
        </Modal>
    }
}

Wizard.propTypes = {
    title: PropTypes.string.isRequired,
    onRun: PropTypes.func
}

Wizard.defaultProps = {
    onRun: filter => console.log(filter)
}

export default Wizard;