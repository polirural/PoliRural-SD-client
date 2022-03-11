

import { Modal, Button, Col, Form, Row } from "react-bootstrap";
import PropTypes from 'prop-types';
import { Save, XSquare } from "react-bootstrap-icons";
import { useCallback, useState } from "react";


export function EditTitle({ save, show, cancel, data }) {

    const [formData, setFormData] = useState(data);

    const onChange = useCallback((event) => {
        setFormData(current => ({
            ...current,
            [event.target.name]: event.target.value,
        }))
    }, [])

    const handleOnShow = useCallback(
      () => {
        setFormData(data);
      },
      [data],
    )
    

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
                        <Col xs={12}>
                            <Form.Group className="mb-8" controlId="model.title">
                                <Form.Label>Model title</Form.Label>
                                <Form.Control type="text" name="title" value={formData.title} onChange={onChange} />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button xs={6} variant="danger" onClick={cancel}><XSquare /> Cancel</Button>
                    <Button xs={6} variant="primary" onClick={() => save(formData)} type="submit"><Save /> Save</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

EditTitle.propTypes = {
    show: PropTypes.bool.isRequired,
    save: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    formData: PropTypes.object.isRequired
}

EditTitle.defaultProps = {
    show: false,
    formData: {
        title: ''
    }
}

export default EditTitle;