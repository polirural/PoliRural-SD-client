import { Col, Container, Row, Tab, Tabs } from 'react-bootstrap';
import { useContext, useEffect } from 'react';

import FilterContext from './context/FilterContext';
import Wizard from './components/Wizard';
import Api from './utils/Api';
import { useCallback } from 'react';
import { useMatch } from 'react-router-dom';
import { DefaultConfig, VIEW_MODE } from './config/config';
import ResultTab from './components/ResultTab';
import SavedScenariosTab from './components/SavedScenariosTab';
import ModelDocTab from './components/ModelDocTab';
import ConfigTab from './components/ConfigTab';

function WizardView(props) {

    const { modelConfig, updateModelConfig, replaceFilter, updateDefaultFilter, inputParameterMode } = useContext(FilterContext);
    const { modelName } = useMatch('/:modelName')?.params;

    // Save model configuration
    const saveModelConfig = useCallback(function _saveModelConfig(newModelConfig) {
        newModelConfig.modelName = modelName;
        updateModelConfig(newModelConfig);
    }, [updateModelConfig, modelName]);

    useEffect(function _loadModelConfig() {
        if (!modelName) return console.debug("No model name specified", modelName);
        Api.get(modelName, "config")
            .then(function _handleResponse(res) {
                if (!res.data || !res.data.value) {
                    throw new Error("No model data in response");
                }
                saveModelConfig(res.data.value);
                replaceFilter({})
            })
            .catch(function _handleError(err) {
                console.warn("Could not load model configuration, reading default and updating in database")
                saveModelConfig(DefaultConfig);
            });
    }, [saveModelConfig, modelName, replaceFilter, updateDefaultFilter]);

    return (
        <Container fluid className="vh-100">
            {modelConfig && inputParameterMode === VIEW_MODE.WIZARD && (
                <Wizard title={modelConfig.title} children={[]} />
            )}
            {modelConfig && (
                <Row>
                    {inputParameterMode === VIEW_MODE.LIST && (
                        <Col xs={12} md={4} lg={3} className="filter-bar">
                            <Wizard title={modelConfig.title} children={[]} />
                        </Col>
                    )}
                    <Col xs={12} md={8} lg={9} className="p-3">
                        <Tabs defaultActiveKey="model-results" id="results-tabs">
                            <Tab eventKey="model-results" key="model-results-tab" title="Results" className="custom-tab-page">
                                <Container className="pt-3">
                                    <ResultTab
                                        key="results-tab-container"
                                        tabTitle="Model results"
                                    />
                                </Container>
                            </Tab>
                            <Tab eventKey="scenarios-config" key="scenarios-tab" title="Scenarios" className="custom-tab-page">
                                <Container className="pt-3">
                                    <SavedScenariosTab
                                        key="scenarios-tab-container"
                                        tabTitle="Model scenarios"
                                    />
                                </Container>
                            </Tab>
                            <Tab eventKey="model-documentation" key="documentation-tab" title="Parameters" className="custom-tab-page">
                                <Container className="pt-3">
                                    <ModelDocTab
                                        key="parameters-tab-container"
                                        tabTitle="Model parameters" />
                                </Container>
                            </Tab >
                            <Tab eventKey="model-config" key="config-tab" title="Configuration" className="custom-tab-page">
                                <Container className="pt-3">
                                    <ConfigTab
                                        key="config-tab-container"
                                        tabTitle="Model configuration"
                                    />
                                </Container>
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
            )}
        </Container >
    )
}

export default WizardView;
