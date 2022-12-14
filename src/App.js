import './App.scss';

import { Container, Nav, NavDropdown, Navbar, Row, Badge } from 'react-bootstrap';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import HomeView from './HomeView';
import { LinkContainer } from 'react-router-bootstrap';
import WizardView from './WizardView';
import { useContext, useMemo } from 'react';
import LoginView from './LoginView';
import ProtectedRoute from './components/ProtectedRoute';
import { PersonFill, UnlockFill } from 'react-bootstrap-icons';
import ReducerContext from './context/ReducerContext';
import DataVizView from './DataVizView';
import RegisterUserView from './RegisterUserView';
import { ProtectedContainer } from './components/ProtectedContainer';
import { USER_ROLES } from './config/config';
import UserListView from './UserListView';

export const models = {
  "apulia_v2_p": { name: "Apulia", component: <WizardView />, image: './images/apulia.jpg', active: true },
  "central_bohemia_p": { name: "Central Bohemian Region", component: <WizardView />, image: './images/central-bohemia.jpg', active: true },
  "central_greece_v3_p": { name: "Central Greece", component: <WizardView />, image: './images/central-greece.jpg', active: true },
  "flanders_land_use2_p": { name: "Flanders", component: <WizardView />, image: './images/flanders.jpg', active: true },
  "galilee_v2_p": { name: "Galilee", component: <WizardView />, image: './images/galilee.jpg', active: true },
  "gevgelija_v2_p": { name: "Gevgelija", component: <WizardView />, image: './images/gevgelija.jpg', active: true },
  "hame_v2_p": { name: "Hame", component: <WizardView />, image: './images/hame.jpg', active: true },
  "monaghan_v2_p": { name: "Monaghan", component: <WizardView />, image: './images/monaghan.jpg', active: true },
  "segobriga_v2_p": { name: "Segobriga", component: <WizardView />, image: './images/segobriga.jpg', active: true },
  "slovak_region_v1_2_p": { name: "Slovakia", component: <WizardView />, image: './images/slovakia.jpg', active: true },
  "vidzeme_v2_p": { name: "Vidzeme", component: <WizardView />, image: './images/vidzeme.jpg', active: true },
}

function App() {

  const { state } = useContext(ReducerContext)
  const { auth } = state;

  const modelNavDropdownItems = useMemo(function _generateModels() {
    return Object.keys(models).sort().filter(k => models[k].active).map((k, i) => {
      return (
        <LinkContainer key={`link-container-${i}`} to={k}>
          <NavDropdown.Item>{models[k].name}</NavDropdown.Item>
        </LinkContainer>
      )
    })
  }, [])

  const modelRoutes = useMemo(function _generateModelRoutes() {
    return Object.keys(models).sort().filter(k => models[k].active).map((k, i) => {
      return (
        <Route
          key={`model-route-${i}`}
          path={`/${k}`}
          element={
            <ProtectedRoute>
              {models[k].component}
            </ProtectedRoute>
          } />
      )
    })
  }, [])

  return (
    <Router basename={`${process.env.PUBLIC_URL}`}>
      <Container fluid style={{ height: "100vh", "flexDirection": "column" }}>
        <Row style={{ height: "56px" }}>
          <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
            <Container fluid>
              <Navbar.Brand href="./">Polirural System Dynamics Tool</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                  <LinkContainer to="/">
                    <Nav.Link>Home</Nav.Link>
                  </LinkContainer>
                  <ProtectedContainer nonAuth>
                    <LinkContainer to="/login">
                      <Nav.Link>Login</Nav.Link>
                    </LinkContainer>
                  </ProtectedContainer>
                  <ProtectedContainer requireRoles={[USER_ROLES.SUPERADMIN]}>
                    <LinkContainer to="/register">
                      <Nav.Link>Register new user</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/user-list">
                      <Nav.Link>List users</Nav.Link>
                    </LinkContainer>
                  </ProtectedContainer>
                  <ProtectedContainer>
                    {auth && (
                      <Nav.Link>
                        Logged in as <Badge bg="info"><PersonFill /> {auth.username}</Badge> <Badge bg="info"><UnlockFill /> {auth.role.join(',')}</Badge>
                      </Nav.Link>
                    )}
                    <LinkContainer to="/logout">
                      <Nav.Link>Logout</Nav.Link>
                    </LinkContainer>
                    <NavDropdown title="Select model" id="basic-nav-dropdown">
                      {modelNavDropdownItems}
                    </NavDropdown>
                  </ProtectedContainer>
                  <ProtectedContainer requireRoles={[USER_ROLES.SUPERADMIN]}>
                    <LinkContainer to="/data-viz">
                      <Nav.Link>Data race demo</Nav.Link>
                    </LinkContainer>
                  </ProtectedContainer>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </Row>
        <Row style={{ flex: 1 }}>
          <Routes>
            <Route
              index
              element={
                <ProtectedRoute key="home-route">
                  <HomeView />
                </ProtectedRoute>
              }
            />
            <Route path={`/login`} key={`login-route`} element={<LoginView />} />
            <Route path={`/logout`} key={`logout-route`} element={<LoginView logout={true} />} />
            <Route path={`/data-viz`} key={`data-viz-route`} element={<DataVizView />} />
            <Route path={`/register`} key={`register-route`} element={<RegisterUserView />} />
            <Route path={`/user-list`} key={`user-list-route`} element={<UserListView />} />
            {modelRoutes}
          </Routes>
        </Row>
      </Container>
    </Router>
  );
}

export default App;
