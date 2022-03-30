

import { Modal, Button, Form, FloatingLabel } from "react-bootstrap";
import PropTypes from 'prop-types';
import { Save, XSquare } from "react-bootstrap-icons";
import { useCallback, useState } from "react";


export function DialogPasteConfig({ show, onSave, onCancel}) {

    const [modelConfigText, setModelConfigText] = useState('');

    const handleOnShow = useCallback(()=>{
        setModelConfigText('');
    }, []);

    return (
        <Modal
            show={show}
            onHide={onCancel}
            onShow={handleOnShow}
            backdrop="static"
            className="custom-dialog"
            size="xl"
            centered
            autoFocus
        >
            <Form onSubmit={(event) => event.preventDefault()}>
                <Modal.Header closeButton>
                    <Modal.Title>Paste model configuration</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FloatingLabel controlId="floatingTextarea2" label="Press [CTRL] + V to paste model configuration text here">
                        <Form.Control onChange={(event) => setModelConfigText(event.target.value)}
                            as="textarea"
                            placeholder="CTRL + V to paste model configuration text into this field"
                            style={{ height: '250px' }}
                            value={modelConfigText}
                        />
                    </FloatingLabel>
                </Modal.Body>
                <Modal.Footer>
                    <Button xs={6} variant="secondary" onClick={() => onCancel()}><XSquare /> Cancel</Button>
                    <Button xs={6} variant="danger" onClick={() => onSave(modelConfigText)} type="submit"><Save /> Import model configuration</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

DialogPasteConfig.propTypes = {
    show: PropTypes.bool.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
}

export default DialogPasteConfig;