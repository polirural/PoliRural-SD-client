import { useCallback, useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import FilterContext from "./context/FilterContext";
import Api from "./utils/Api";

export function LoginView({ logout }) {

    const { auth, setAuth } = useContext(FilterContext);

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
        },
        [setAuth]
    )

    const doLogin = useCallback(
        () => {
            Api.doLogin(authRequest).then(res => {
                setAuth(res.data)
            }).catch((err) => {
                doLogout()
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
        <Form>
            <Modal
                show={true}
                backdrop="static"
                centered
                autoFocus
            >
                <Modal.Header>
                    <Modal.Title>Login form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="text" value={authRequest.username} name="username" placeholder="Enter username" onChange={onChange} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" value={authRequest.password} name="password" placeholder="Enter password" onChange={onChange} />
                    </Form.Group>
                    <Form.Text className="text-muted">
                        For testing purposes, you may login using demo/demo
                    </Form.Text>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={doLogin}>Login</Button>
                    {/* <Button variant="secondary">Reminder</Button>
                    <Button variant="secondary">Register</Button> */}
                </Modal.Footer>
            </Modal>
        </Form>
    )
}

export default LoginView;