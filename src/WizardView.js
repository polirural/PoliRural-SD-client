import { Col, Container, Row, Tab, Tabs } from 'react-bootstrap';
import { useContext, useEffect } from 'react';

import Wizard from './components/Wizard';
import { useMatch } from 'react-router-dom';
import ResultTab from './components/ResultTab';
import SavedScenariosTab from './components/SavedScenariosTab';
import ModelDocTab from './components/ModelDocTab';
import ConfigTab from './components/ConfigTab';
import Api from './utils/Api';
import { USER_ROLES } from './config/config';
import ReducerContext from './context/ReducerContext';
import Loading from './components/Loading';

function WizardView() {

    const { modelName } = useMatch('/:modelName')?.params;
    const { state, dispatch } = useContext(ReducerContext);
    const { auth, modelConfig, modelLoading } = state;

    useEffect(() => {

        dispatch({
            type: "modelLoading",
            payload: true
        });

        Promise.all([
            Api.getConfig(modelName),
            Api.getDoc(modelName),
            Api.getScenarios(modelName)
        ]).then((res) => {
            if (!res.every(r => r.status === 200)) throw new Error("An issue occurred");
            let modelConfig = res[0].data;
            let modelDoc = res[1].data;
            let modelScenarios = res[2].data;
            Api.runModel(modelName, modelScenarios.value.default).then(modelRes => {
                let modelData = modelRes.data;
                dispatch({
                    type: "initModel",
                    payload: {
                        modelConfig: modelConfig.value,
                        modelName,
                        filter: modelScenarios.value.default,
                        defaultFilter: modelScenarios.value.default,
                        inputParameters: modelDoc.map(d => '' + d["Py Name"]),
                        displayParameters: Object.keys(modelData[0]),
                        scenarios: modelScenarios.value,
                        compareScenario: "default",
                        modelDoc,
                        modelData,
                        modelBaselineData: modelData,
                        runModel: false,
                        modelLoading: false
                    }
                })
            }).catch(err => {
                console.error(err);
            }).finally(() => {
                dispatch({
                    type: "modelLoading",
                    payload: false
                })

            })
        }).catch(err => {
            console.error(err);
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
