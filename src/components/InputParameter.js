

import { Modal, Button, Col, Form, Row } from "react-bootstrap";
import PropTypes from 'prop-types';
import { Save, XSquare } from "react-bootstrap-icons";
import { useCallback, useState } from "react";
import TypeAheadDropDown from './TypeAheadDropDown';


export function InputParameter({ selectedParameter, modelConfig, inputParameters, save, show, cancel }) {

    const [formData, setFormData] = useState({
        "parameter": "",
        "order": "",
        "title": "",
        "label": "",
        "help": "",
        "type": "number",
        "defaultValue": 1,
        "min": 1,
        "max": 10,
        "tmin": 2022,
        "tmax": 2042
    });

    const handleOnShow = useCallback((event) => {
        if (selectedParameter && modelConfig && modelConfig.parameters && modelConfig.parameters[selectedParameter]) {
            let currentFormData = modelConfig.parameters[selectedParameter];
            currentFormData["parameter"] = selectedParameter;
            setFormData(currentFormData);
        }
    }, [selectedParameter, modelConfig])

    const handleOnChange = useCallback((event) => {
        setFormData(current => ({
            ...current,
            [event.target.name]: event.target.value,
        }))
    }, [])

    const handleOnSubmit = useCallback((event) => {
        const { parameter, ...cleanFormData } = formData;
        save({ [parameter]: cleanFormData });
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
            <Form onSubmit={(event) => event.preventDefault()}>
                <Modal.Header closeButton>
                    <Modal.Title>Add/edit input parameters</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={1}>
                            <Form.Group className="mb-4" controlId="parameter.order">
                                <Form.Label>#</Form.Label>
                                <Form.Control name="order" type="text" value={formData.order} onChange={handleOnChange} />
                            </Form.Group>
                        </Col>
                        <Col xs={4}>
                            <Form.Group className="mb-4" controlId="parameter.key">
                                <Form.Label>Parameter name</Form.Label>
                                <TypeAheadDropDown key="test" name="parameter" items={inputParameters} value={formData.parameter} onChange={handleOnChange} />
                            </Form.Group>
                        </Col>
                        <Col xs={7}>
                            <Form.Group className="mb-8" controlId="parameter.title">
                                <Form.Label>Title</Form.Label>
                                <Form.Control name="title" type="text" value={formData.title} onChange={handleOnChange} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-12" controlId="parameter.label">
                                <Form.Label>Field label</Form.Label>
                                <Form.Control name="label" as="textarea" rows={2} value={formData.label} onChange={handleOnChange} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-12" controlId="parameter.help">
                                <Form.Label>Help text</Form.Label>
                                <Form.Control name="help" as="textarea" rows={4} value={formData.help} onChange={handleOnChange} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={4}>
                            <Form.Group className="mb-4" controlId="parameter.type">
                                <Form.Label>Type</Form.Label>
                                <Form.Select name="type" as="select" value={formData.type} onChange={handleOnChange} >
                                    <option value="graph">Graph data input</option>
                                    <option value="number">Number input</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="parameter.defaultValue">
                                <Form.Label>Default value</Form.Label>
                                <Form.Control name="defaultValue" type="number" value={formData.defaultValue} onChange={handleOnChange} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="parameter.min">
                                <Form.Label>Min value</Form.Label>
                                <Form.Control name="min" type="number" value={formData.min} onChange={handleOnChange} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="parameter.max">
                                <Form.Label>Max value</Form.Label>
                                <Form.Control name="max" type="number" value={formData.max} onChange={handleOnChange} />
                            </Form.Group>
                        </Col>
                        {formData.type === "graph" && (
                            <Col>
                                <Form.Group className="mb-3" controlId="parameter.tmin">
                                    <Form.Label>Min timestep</Form.Label>
                                    <Form.Control name="tmin" type="number" value={formData.tmin} onChange={handleOnChange} />
                                </Form.Group>
                            </Col>
                        )}
                        {formData.type === "graph" && (
                            <Col>
                                <Form.Group className="mb-3" controlId="parameter.tmax">
                                    <Form.Label>Max timestep</Form.Label>
                                    <Form.Control name="tmax" type="number" value={formData.tmax} onChange={handleOnChange} />
                                </Form.Group>
                            </Col>
                        )}
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

InputParameter.propTypes = {
    inputParameters: PropTypes.arrayOf(PropTypes.string).isRequired,
    show: PropTypes.bool.isRequired,
    save: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    modelConfig: PropTypes.object.isRequired,
    selectedParameter: PropTypes.string
}

InputParameter.defaultProps = {
    show: false,
    selectedParameter: ''
}

export default InputParameter;