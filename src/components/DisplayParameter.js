

import { Modal, Button, Col, Form, Row } from "react-bootstrap";
import PropTypes from 'prop-types';
import { Save, XSquare } from "react-bootstrap-icons";
import { useEffect, useRef, useCallback } from "react";
import TypeAheadDropDown from './TypeAheadDropDown';


export function DisplayParameter({ displayParameters, save, show, cancel}) {

    const htmlForm = useRef(null);

    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const values = Object.fromEntries(data.entries());
        // TODO: For multi values, iterate and use get all on relevant keys of "value"
        const { parameter, ...subvalues } = values;
        const param = {};
        param[parameter] = { ...subvalues };
        save(param);
    }, [save]);

    useEffect(() => {
        if (!htmlForm.current) return;
        // Remove if exists
        htmlForm.current.removeEventListener("submit", handleSubmit);
        htmlForm.current.addEventListener("submit", handleSubmit);
    }, [handleSubmit])

    return (
        <Modal
            show={show}
            onHide={cancel}
            backdrop="static"
            className="custom-dialog"
            size="xl"
            centered
            autoFocus
        >
            <Form ref={htmlForm}>
                <Modal.Header closeButton>
                    <Modal.Title>Add/edit input parameters</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={4}>
                            <Form.Group className="mb-4" controlId="parameter.key">
                                <Form.Label>Parameter name</Form.Label>
                                <TypeAheadDropDown name="parameter" items={displayParameters} />
                            </Form.Group>
                        </Col>
                        <Col xs={8}>
                            <Form.Group className="mb-8" controlId="parameter.title">
                                <Form.Label>Title for charts and tables</Form.Label>
                                <Form.Control name="title" type="text" />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button xs={6} variant="danger" onClick={cancel}><XSquare /> Cancel</Button>
                    <Button xs={6} variant="primary" type="submit"><Save /> Save</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

DisplayParameter.propTypes = {
    displayParameters: PropTypes.arrayOf(PropTypes.string).isRequired,
    show: PropTypes.bool.isRequired,
    save: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired
}

DisplayParameter.defaultProps = {
    show: false
}

export default DisplayParameter;