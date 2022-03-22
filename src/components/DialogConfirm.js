

import { Modal, Button, Form } from "react-bootstrap";
import PropTypes from 'prop-types';
import { Save, XSquare } from "react-bootstrap-icons";
import { useCallback } from "react";


export function DialogConfirm({ show, title, description, onChoose, okLabel = "OK", cancelLabel = "Cancel" }) {

    return (
        <Modal
            show={true}
            onHide={() => onConfirm(false)}
            onShow={handleOnShow}
            backdrop="static"
            className="custom-dialog"
            size="xl"
            centered
            autoFocus
        >
            <Form onSubmit={(event) => event.preventDefault()}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                {description && (<Modal.Body>
                    {description}
                </Modal.Body>
                )}
                <Modal.Footer>
                    <Button xs={6} variant="secondary" onClick={() => onConfirm(false)}><XSquare /> {cancelLabel}</Button>
                    <Button xs={6} variant="danger" onClick={() => onConfirm(true)} type="submit"><Save /> {okLabel}</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

DialogConfirm.propTypes = {
    show: PropTypes.bool.isRequired,
    onChoose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    okLabel,
    cancelLabel
}

DialogConfirm.defaultProps = {
    okLabel: "OK",
    cancelLabel: 'Cancel'
}

export default DialogConfirm;