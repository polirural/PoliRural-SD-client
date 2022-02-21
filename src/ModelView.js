import { Tab, Tabs } from "react-bootstrap";
import { PropTypes } from 'prop-types';
import ResultTab from "./components/ResultTab";
import ConfigTab from "./components/ConfigTab";
import { SavedScenariosTab } from "./components/SavedScenariosTab";
import ModelDocTab from "./components/ModelDocTab";

function ModelView() {
    return (
        <Tabs defaultActiveKey="model-results" id="results-tabs" className="mb-3">
            <Tab eventKey="model-results" key="model-results-tab" title="Results">
                <ResultTab
                    key="results-tab-container"
                    tabTitle="Model results"
                />
            </Tab>
            <Tab eventKey="scenarios-config" key="scenarios-tab" title="Scenarios">
                <SavedScenariosTab
                    key="scenarios-tab-container"
                    tabTitle="Model scenarios"
                />
            </Tab>
            <Tab eventKey="model-documentation" key="documentation-tab" title="Parameters">
                <ModelDocTab
                    key="parameters-tab-container"
                    tabTitle="Model parameters" />
            </Tab >
            <Tab eventKey="model-config" key="config-tab" title="Configuration">
                <ConfigTab
                    key="config-tab-container"
                    tabTitle="Model configuration"
                />
            </Tab>

        </Tabs >
    )
}

ModelView.propTypes = {
    modelConfig: PropTypes.object.isRequired
}

export default ModelView;