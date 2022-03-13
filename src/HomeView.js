import { Button, Card, Col, Container, Row } from "react-bootstrap"

import { models } from './App';
import { useMemo } from 'react';
import { LinkContainer } from "react-router-bootstrap";

export function HomeView() {

    const modelViews = useMemo(() => {
        return Object.keys(models).sort().map((modelKey, modelIdx) => {
            return (
                <Col key={`mode-tile-${modelKey}-${modelIdx}`} xs={12} sm={6} lg={4} className="mb-3">
                    <Card>
                        <Card.Img variant="top" style={
                            { "objectFit": "cover", "height": "300px" }
                        } src={models[modelKey].image} />
                        <Card.Body>
                            <Card.Title>{models[modelKey].name}</Card.Title>
                            <Card.Text>
                                {models[modelKey].description || ''}
                            </Card.Text>
                            <div className="d-grid gap-2">
                                <LinkContainer to={`/${modelKey}`}>
                                    <Button variant="primary" disabled={!models[modelKey].active}>Open {models[modelKey].name} model</Button>
                                </LinkContainer>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            );
        });
    }, [])

    return (
        <Container fluid>
            <h1 className="my-3">Introducing the Polirural System Dynamics Tool</h1>
            <p>This is the landing page for the System Dynamics Tool prototype developed through the Polirural project. The purpose of this tool is to leverage the access to System Dynamics simulations for non-experts involved in foresight analysis, policy and strategy formulation for rural communities.</p>
            <p>The models have been developed collectively by all pilot regions partaking in the project and have been practically implemented by 22Sistema.</p>
            <p>This tool has been developed in cooperation between 22Sistema, Asplan Viak with key contributions from other partners including BOSC</p>
            <h4 className="my-3">Select one of the following models to get started</h4>
            <p>Models with dimmed buttons are presently offline due to maintenance and will be back online shortly</p>
            <Row>
                {modelViews}
            </Row>
        </Container>
    )
}

export default HomeView;