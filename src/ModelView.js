import { Container, Tab, Tabs } from "react-bootstrap";
import ResultTab from "./components/ResultTab";
import ConfigTab from "./components/ConfigTab";
import SavedScenariosTab from "./components/SavedScenariosTab";
import ModelDocTab from "./components/ModelDocTab";

function ModelView() {

    return (
        <div className="model-container p-3">
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
        </div>
    )
}

ModelView.propTypes = {
}

export default ModelView;