import { useCallback, useContext, useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import Loading from "./components/Loading";
import FilterContext from "./context/FilterContext";
import Api from "./utils/Api";

export function LoginView({ logout }) {

    const { auth, setAuth } = useContext(FilterContext);
    const [authenticating, setAuthenticating] = useState(false);

    const [authRequest, setAuthRequest] = useState({
        username: '',
        password: ''
    });

    const onChange = useCallback(
        (t) => {
            setAuthRequest((current) => ({
                ...current,
                [t.target.name]: t.target.value
            }));
        },
        [setAuthRequest],
    )

    const doLogout = useCallback(
        () => {
            setAuth()
            Api.authorized(null)
            setAuthenticating(false);
        },
        [setAuth]
    )

    const doLogin = useCallback(
        () => {
            Api.doLogin(authRequest).then(res => {
                setAuth(res.data);
                Api.authorized(res.data);
            }).catch((err) => {
                doLogout()
            }).finally(() => {
                setAuthenticating(false);
            })
        },
        [authRequest, setAuth, doLogout]
    )

    useEffect(() => {
        if (logout) {
            doLogout();
        }
        return () => { }
    }, [logout, doLogout])

    if (logout) {
        return (<Navigate to="/login" />)
    }

    if (auth) {
        return (<Navigate to="/" />)
    }

    return (
        <>
            <Modal
                show={!authenticating}
                backdrop="static"
                centered
                autoFocus
            >
                <Modal.Header>
                    <Modal.Title>Login form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                            <Form.Label column xs={3}>Username</Form.Label>
                            <Col xs={9}>
                                <Form.Control type="text" value={authRequest.username} name="username" placeholder="Enter username" autoComplete="username" onChange={onChange} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="formBasicPassword">
                            <Form.Label column xs={3}>Password</Form.Label>
                            <Col xs={9}>
                                <Form.Control type="password" value={authRequest.password} name="password" placeholder="Enter password" autoComplete="current-password" onChange={onChange} />
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={doLogin}>Login</Button>
                </Modal.Footer>
            </Modal>
            <Loading show={authenticating} message="Please wait, authenticating..." />

        </>
    )
}

export default LoginView;