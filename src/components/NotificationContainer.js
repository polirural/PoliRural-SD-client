import { useEffect, useRef, useState } from "react";
import { Modal, Button } from "react-bootstrap";

export function NotificationContainer({ title, message, timeout, children }) {

    const [render, setRender] = useState(false);
    const ticker = useRef(null);

    useEffect(() => {
        if (ticker.current) {
            clearTimeout(ticker.current);
        }
        ticker.current = setTimeout(() => {
            setRender(true);
        }, timeout)
        return () => {
            clearTimeout(ticker.current);
        }
    }, [timeout]);

    if (!render) {
        return (
            <Modal
                backdrop="static"
                centered
            >
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {message}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setRender(true)}>Dismiss</Button>
                </Modal.Footer>
            </Modal >
        )
    } else {
        return (
            <>
                {children}
            </>
        )
    }
}

export default NotificationContainer;