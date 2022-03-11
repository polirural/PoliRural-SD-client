

import { Modal, Button, Col, Form, Row } from "react-bootstrap";
import PropTypes from 'prop-types';
import { Save, XSquare } from "react-bootstrap-icons";
import { useCallback, useState } from "react";
import TypeAheadDropDown from './TypeAheadDropDown';


export function DisplayParameter({ displayParameters, selectedParameter, modelConfig, save, show, cancel }) {
    
    const [formData, setFormData] = useState({
        parameter: '',
        title: ''
    });

    const handleOnShow = useCallback((event) => {
        if (selectedParameter && modelConfig && modelConfig.visualizations && modelConfig.visualizations[selectedParameter]) {
            let currentFormData = {title: modelConfig.visualizations[selectedParameter]};
            currentFormData["parameter"] = selectedParameter;
            setFormData(currentFormData);
        }
    }, [modelConfig, selectedParameter])

    const handleOnChange = useCallback(
        (event) => {
            setFormData(current => ({
                ...current,
                [event.target.name]: event.target.value
            }))
        },
        [],
    )

    const handleOnSubmit = useCallback((event) => {
        const { parameter, title } = formData;
        save({ [parameter]: title });
    }, [formData, save])


    return (
        <Modal
            show={show}
            onHide={cancel}
            onShow={handleOnShow}
            backdrop="static"
            className="custom-dialog"
            size="xl"
            centered
            autoFocus
        >
            <Form onSubmit={event => event.preventDefault()}>
                <Modal.Header closeButton>
                    <Modal.Title>Add/edit input parameters</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={4}>
                            <Form.Group className="mb-4" controlId="parameter.key">
                                <Form.Label>Parameter name</Form.Label>
                                <TypeAheadDropDown name="parameter" value={formData.parameter} onChange={handleOnChange} items={displayParameters} />
                            </Form.Group>
                        </Col>
                        <Col xs={8}>
                            <Form.Group className="mb-8" controlId="parameter.title">
                                <Form.Label>Title for charts and tables</Form.Label>
                                <Form.Control name="title" type="text" value={formData.title} onChange={handleOnChange} />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button xs={6} variant="danger" onClick={cancel}><XSquare /> Cancel</Button>
                    <Button xs={6} variant="primary" onClick={handleOnSubmit} type="submit"><Save /> Save</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

DisplayParameter.propTypes = {
    displayParameters: PropTypes.arrayOf(PropTypes.string).isRequired,
    modelConfig: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    save: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    selectedParameter: PropTypes.string
}

DisplayParameter.defaultProps = {
    show: false,
}

export default DisplayParameter;