import { Button, Container, Stack, Table } from "react-bootstrap"
import { useCallback, useEffect, useState } from 'react';
import Api from "./utils/Api";

export function UserListView() {

    const [users, setUsers] = useState([]);

    const loadUsers = useCallback(() => {
        Api.getUserList().then(res => {
            setUsers(res.data.map(d => (<tr key={`key-user-${d.username}`}>
                <td>{d.username}</td>
                <td>{d.role.join(", ")}</td>
                <td>
                    <Stack direction="horizontal" gap={2}>
                        <Button variant="secondary">Assign role</Button>
                        <Button variant="danger">Reset password</Button>
                        <Button variant="danger" onClick={() => {
                            Api.deleteUser(d.username).then(res => {
                                console.log(res.data, this);
                            })
                        }}>Delete</Button>
                    </Stack>
                </td>
            </tr>)));
        })
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers])

    return (
        <Container fluid>
            <h3>Users</h3>
            <Table striped>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users}
                </tbody>
            </Table>
        </Container>
    )
}

export default UserListView;