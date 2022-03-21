import PropTypes from 'prop-types';
import { Modal, Spinner } from 'react-bootstrap';

export function Loading({ show, message, tagLine }) {
    return (
        <Modal
            show={show}
            centered
            backdrop="static"
        >
            <Modal.Body className="text-center">
                <Spinner animation="border" variant="primary" className="mt-5" />
                <h4 className="my-5">{message}</h4>
                <p>{tagLine}</p>
            </Modal.Body>
        </Modal>
    )
}

Loading.propTypes = {
    show: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    tagLine: PropTypes.string
};

Loading.defaultProps = {
    message: "Please wait, working",
    tagLine: "This may take some time"
}

export default Loading;