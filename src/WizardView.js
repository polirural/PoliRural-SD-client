import { Col, Container, Row, Tab, Tabs } from 'react-bootstrap';
import { useContext, useEffect } from 'react';

import FilterContext from './context/FilterContext';
import Wizard from './components/Wizard';
import { useMatch } from 'react-router-dom';
import ResultTab from './components/ResultTab';
import SavedScenariosTab from './components/SavedScenariosTab';
import ModelDocTab from './components/ModelDocTab';
import ConfigTab from './components/ConfigTab';
import Api from './utils/Api';
import { clone } from './utils/Object';
import { DefaultConfig, USER_ROLES } from './config/config';

function WizardView() {

    const { auth, modelConfig, setModelName, updateModelConfig, setModelConfig, setFilter, setDefaultFilter, setScenarios, setRunModel, setCompareScenario } = useContext(FilterContext);
    const { modelName } = useMatch('/:modelName')?.params;

    useEffect(() => {
        setModelName(modelName);
    }, [modelName, setModelName])

    // Save model configuration
    // Load model config whenever it changes
    useEffect(function _loadModelConfig() {
        if (!modelName) return console.debug("No model name specified", modelName);
        // Clear all before loading model configuration
        setFilter({});
        setDefaultFilter({});
        setModelConfig(null);
        setScenarios({ default: {} });
        setCompareScenario('default');
        setRunModel(false);

        // Load all data
        setTimeout(() => {
            Api.getConfig(modelName)
                .then(function _handleResponse(res) {
                    if (!res.data || !res.data.value) {
                        throw new Error("No model data in response");
                    }
                    setModelConfig(res.data.value);
                })
                .catch(function _handleError(err) {
                    console.warn("Could not load model configuration, reading default and updating in database")
                    updateModelConfig({
                        ...clone(DefaultConfig),
                        modelName
                    });
                }).finally(() => {
                    setTimeout(() => {
                        setRunModel(true);
                    }, 50)
                });
        }, 50)
    }, [modelName, setModelConfig, updateModelConfig, setDefaultFilter, setFilter, setScenarios, setRunModel, setCompareScenario]);

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
        </Container >
    )
}

export default WizardView;
