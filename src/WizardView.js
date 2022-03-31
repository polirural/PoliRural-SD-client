import { Col, Container, Row, Tab, Tabs } from 'react-bootstrap';
import { useContext, useEffect } from 'react';

import Wizard from './components/Wizard';
import { useMatch } from 'react-router-dom';
import ResultTab from './components/ResultTab';
import SavedScenariosTab from './components/SavedScenariosTab';
import ModelDocTab from './components/ModelDocTab';
import ConfigTab from './components/ConfigTab';
import { USER_ROLES } from './config/config';
import ReducerContext from './context/ReducerContext';
import Loading from './components/Loading';
import { initModel, resetModelConfig } from './utils/Model';
import Api from './utils/Api';

function WizardView() {

    const { modelName } = useMatch('/:modelName')?.params;
    const { state, dispatch } = useContext(ReducerContext);
    const { auth, modelConfig, modelLoading } = state;

    useEffect(() => {
        Api.getConfig(modelName).then(modelConfigRes => {
            console.info(`Initializing "${modelName}" model`);
            initModel(modelName, modelConfigRes.data.value, dispatch);
        }).catch(err => {
            console.info(`Resetting "${modelName}" model configuration, missing or invalid config`, err);
            resetModelConfig(modelName, dispatch);
        })
    }, [modelName, dispatch])

    return (
        <Container fluid className="vh-100">
            {modelConfig && (
                <Row>
                    <Col xs={12} md={4} lg={3} className="filter-bar">
                        <Wizard title={modelConfig.title} children={[]} key={`wizard-${modelName}`} />
                    </Col>
                    <Col xs={12} md={8} lg={9} className="p-3">
                        <Tabs defaultActiveKey="model-results" id="results-tabs">
                            <Tab eventKey="model-results" key="model-results-tab" title="Results" className="custom-tab-page">
                                <Container className="pt-3">
                                    <ResultTab
                                        key={`results-tab-container-${modelName}`}
                                        tabTitle="Model results"
                                    />
                                </Container>
                            </Tab>
                            <Tab eventKey="scenarios-config" key="scenarios-tab" title="Scenarios" className="custom-tab-page">
                                <Container className="pt-3">
                                    <SavedScenariosTab
                                        key={`scenarios-tab-container-${modelName}`}
                                        tabTitle="Model scenarios"
                                    />
                                </Container>
                            </Tab>
                            {auth && Array.isArray(auth.role) && [USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN].some(curr_role => auth.role.indexOf(curr_role) > -1) && (
                                <Tab eventKey="model-documentation" key="documentation-tab" title="Parameters" className="custom-tab-page">
                                    <Container className="pt-3">
                                        <ModelDocTab
                                            key={`parameters-tab-container-${modelName}`}
                                            tabTitle="Model parameters" />
                                    </Container>
                                </Tab>
                            )}
                            {auth && Array.isArray(auth.role) && [USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN].some(curr_role => auth.role.indexOf(curr_role) > -1) && (
                                <Tab eventKey="model-config" key="config-tab" title="Configuration" className="custom-tab-page">
                                    <Container className="pt-3">
                                        <ConfigTab
                                            key={`config-tab-container-${modelName}`}
                                            tabTitle="Model configuration"
                                        />
                                    </Container>
                                </Tab>
                            )}
                        </Tabs>
                    </Col>
                </Row>
            )}
            <Loading show={modelLoading} message="Executing model, please wait..." tagLine="Trees that are slow to grow bear the best fruit." />
        </Container >
    )
}

export default WizardView;
