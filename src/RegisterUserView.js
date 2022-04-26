import { useCallback, useContext, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import Loading from "./components/Loading";
import NotificationContainer from "./components/NotificationContainer";
import { USER_ROLES } from "./config/config";
import ReducerContext from "./context/ReducerContext";
import Api from "./utils/Api";

export function RegisterUserView() {

    const { state } = useContext(ReducerContext);
    const { auth } = state;
    const [redirect, setRedirect] = useState(false);
    const [close, setClose] = useState(false);

    const [executing, setExecuting] = useState(false);

    const [registerData, setRegisterData] = useState({
        username: '',
        password: '',
        role: USER_ROLES.VIEWER
    });

    const onChange = useCallback(
        (t) => {
            setRegisterData((current) => ({
                ...current,
                [t.target.name]: t.target.value
            }));
        },
        [setRegisterData],
    )

    const doRegister = useCallback(
        () => {
            setExecuting(true);
            Api.doRegister(registerData).then(res => {
                console.log(res);
                setRedirect(true);
            }).catch((err) => {
                setRedirect(false);
            }).finally(() => {
                setExecuting(false);
            })
        },
        [registerData, setRedirect]
    )

    if (redirect) return (
        <NotificationContainer title="User registerred" message="Success" timeout={2000}>
            <Navigate to="/" />
        </NotificationContainer>
    )

    if (close) return (
        <Navigate to="/" />
    )

    return (
        <>
            <Modal
                show={!executing}
                backdrop="static"
                centered
                autoFocus
            >
                <Modal.Header>
                    <Modal.Title>User registration form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                            <Form.Label column xs={3}>Username</Form.Label>
                            <Col xs={9}>
                                <Form.Control type="text" value={registerData.username} name="username" placeholder="Enter username" autoComplete="username" onChange={onChange} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="formBasicPassword">
                            <Form.Label column xs={3}>Password</Form.Label>
                            <Col xs={9}>
                                <Form.Control type="password" value={registerData.password} name="password" placeholder="Enter password" autoComplete="current-password" onChange={onChange} />
                            </Col>
                        </Form.Group>
                        {auth && auth.role.some(r => r === USER_ROLES.SUPERADMIN) && <Form.Group as={Row} className="mb-3" controlId="formBasicPassword">
                            <Form.Label column xs={3}>User role</Form.Label>
                            <Col xs={9}>
                                <Form.Control as="select" value={registerData.password} name="password" placeholder="Select a role type" autoComplete="current-role" onChange={onChange}>
                                    <option value="viewer">Viewer</option>
                                    <option value="admin">Admin</option>
                                    <option value="superadmin">Superadmin</option>
                                </Form.Control>
                            </Col>
                        </Form.Group>}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setClose(true)}>Cancel</Button>
                    <Button variant="primary" onClick={doRegister}>Register user</Button>
                </Modal.Footer>
            </Modal>
            <Loading show={executing} message="Please wait, registerring user..." />
        </>
    )
}

export default RegisterUserView;