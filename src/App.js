import './App.scss';

import { Container, Nav, NavDropdown, Navbar, Row } from 'react-bootstrap';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import HomeView from './HomeView';
import { LinkContainer } from 'react-router-bootstrap';
import WizardView from './WizardView';
import { useContext, useEffect, useMemo } from 'react';
import Api from './utils/Api';
import LoginView from './LoginView';
import ProtectedRoute from './components/ProtectedRoute';
import FilterContext from './context/FilterContext';

export const models = {
  "central_greece_v2_p": { name: "Central Greece", component: <WizardView />, image: './images/central-greece.jpg' },
  "flanders_land_use_p": { name: "Flanders", component: <WizardView />, image: './images/flanders.jpg' },
  "gevgelija_v2_p": { name: "Gevgelija", component: <WizardView />, image: './images/gevgelija.jpg' },
  "hame_v2_p": { name: "Hame", component: <WizardView />, image: './images/hame.jpg' },
  "monaghan_v2_p": { name: "Monaghan", component: <WizardView />, image: './images/monaghan.jpg' },
  "segobriga_v2_p": { name: "Segobriga", component: <WizardView />, image: './images/segobriga.jpg' },
  "vidzeme_v2_p": { name: "Vidzeme", component: <WizardView />, image: './images/vidzeme.jpg' }
}

function App() {

  const { auth } = useContext(FilterContext);

  useEffect(() => {
    async function update() {
      await Api.set("test", "last-login", new Date())
    }
    update();
  }, [])

  const modelNavDropdownItems = useMemo(function _generateModels() {
    return Object.keys(models).map((k, i) => {
      return (
        <LinkContainer key={`link-container-${i}`} to={k}>
          <NavDropdown.Item>{models[k].name}</NavDropdown.Item>
        </LinkContainer>
      )
    })
  }, [])

  const modelRoutes = useMemo(function _generateModelRoutes() {
    return Object.keys(models).map((k, i) => {
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
      <Container fluid>
        <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
          <Container fluid>
            <Navbar.Brand href="./">Polirural System Dynamics Tool</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <LinkContainer to="/">
                  <Nav.Link>Home</Nav.Link>
                </LinkContainer>
                {!auth && (
                  <LinkContainer to="/login">
                    <Nav.Link>Login</Nav.Link>
                  </LinkContainer>
                )}
                {auth && (
                  <LinkContainer to="/logout">
                    <Nav.Link>Logout</Nav.Link>
                  </LinkContainer>
                )}
                <NavDropdown title="Select model" id="basic-nav-dropdown">
                  {modelNavDropdownItems}
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Row>
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
            {modelRoutes}
          </Routes>
        </Row>
      </Container>
    </Router>
  );
}

export default App;
