import './App.scss';

import { Container, Nav, NavDropdown, Navbar, Row } from 'react-bootstrap';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import HomeView from './HomeView';
import { LinkContainer } from 'react-router-bootstrap';
import VidzemeWizard from './VidzemeWizard';
import { useEffect } from 'react';
import Api from './utils/Api';
import FilterProvider from './context/FilterProvider';

export const models = {
  "central_greece_v2_p": { name: "Central Greece", component: <VidzemeWizard />, image: './images/central-greece.jpg' },
  "flanders_land_use_p.py": { name: "Flanders", component: <VidzemeWizard />, image: './images/flanders.jpg' },
  "gevgelija_v2_p": { name: "Gevgelija", component: <VidzemeWizard />, image: './images/gevgelija.jpg' },
  "hame_v2_p": { name: "Hame", component: <VidzemeWizard />, image: './images/hame.jpg' },
  "monaghan_v2_p": { name: "Monaghan", component: <VidzemeWizard />, image: './images/monaghan.jpg' },
  "segobriga_v2_p": { name: "Segobriga", component: <VidzemeWizard />, image: './images/segobriga.jpg' },
  "vidzeme_v2_p": { name: "Vidzeme", component: <VidzemeWizard />, image: './images/vidzeme.jpg' }
}

function App() {

  useEffect(() => {
    async function update() {
      await Api.set("test", "last-login", new Date())
    }
    update();
  }, [])

  return (
    <FilterProvider>
      <Router basename={`${process.env.PUBLIC_URL}`}>
        <Container fluid>
          <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
            <Container fluid>
              <Navbar.Brand href="./">Polirural System Dynamics Tool</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                  <Nav.Link href="#home">Back to Polirural DIH</Nav.Link>
                  <Nav.Link href="#home">About</Nav.Link>
                  <NavDropdown title="Choose model" id="basic-nav-dropdown">
                    {Object.keys(models).map((k, i) => {
                      return (
                        <LinkContainer key={`link-container-${i}`} to={k}>
                          <NavDropdown.Item>{models[k].name}</NavDropdown.Item>
                        </LinkContainer>
                      )
                    })}
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <Row>
            <Routes>
              <Route index element={<HomeView />} />
              {Object.keys(models).map((k, i) => {
                return (
                  <Route path={`/${k}`} key={`model-route-${i}`} element={models[k].component} />
                )
              })}
            </Routes>
          </Row>
        </Container>
      </Router>
    </FilterProvider>
  );
}

export default App;
