import { Badge, Button, ButtonGroup, Modal, Row } from 'react-bootstrap';
import { React, useContext, useState } from 'react';

import FilterContext from '../context/FilterContext';
import { PropTypes } from 'prop-types';
import { useCallback } from 'react';

const viewMode = {
    wizard: "wizard",
    list: "list"
}

function Wizard({ title, children, onRun }) {

    const {filter, setShowHelp, showHelp} = useContext(FilterContext)    
    const [page, setPage] = useState(0)
    const [view, setView] = useState(viewMode.wizard)

    const changePage = useCallback((currentPage, increment = 1) => {
        if (currentPage <= 0 && increment < 0) return;
        if (currentPage > children.length - 1) return;
        setPage(currentPage + increment);
    }, [children]);

    if (view === viewMode.list) {
        return <div className="wizard-container p-3">
            <h3>{title}</h3>
            <ButtonGroup size="sm">
                <Button onClick={() => setView(viewMode.wizard)}>Wizard mode</Button>
                <Button onClick={() => setShowHelp(!showHelp)}>{showHelp ? 'Hide help' : 'Show help'}</Button>
                <Button onClick={() => setView(viewMode.wizard)}>Reset parameters</Button>
            </ButtonGroup>
            <div className="wizard-page-container">
                {children}
            </div>
        </div>
    } else if (view === viewMode.wizard) {
        return <Modal
            show={true}
            backdrop="static"
            centered
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
                <Button variant="secondary" disabled={!(page === children.length - 1)} onClick={() => onRun(filter)}>Run model</Button>
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