import { Col, Container, Row } from 'react-bootstrap';
import { useContext, useEffect } from 'react';

import { DrawLineChart } from './components/DrawLineChart';
import FilterContext from './context/FilterContext';
import HelpText from './components/HelpText';
import ModelView from './ModelView';
import NumberInput from './components/NumberInput';
import Wizard from './components/Wizard';
import WizardPage from "./components/WizardPage";
import { useMemo } from 'react';
import Api from './utils/Api';
import { useCallback } from 'react';
import { useMatch } from 'react-router-dom';

// Model configuration
const _config = {
    "modelName": 'vidzeme_v2_p',
    "title": 'Vidzeme Rural Development',
    "parameters": {
        "average_life_of_an_industrial_business": {
            title: 'Average life time of an industrial business',
            label: 'Life time in years',
            help: 'Choose a value between 0 and 30 years. This is the expected value for the end of the simulation period 2041',
            defaultValue: 20,
            min: 0,
            max: 30,
            type: 'number'
        },
        "average_life_of_a_service_business": {
            title: 'Average life time of a service business',
            label: 'Life time in years',
            help: 'Choose a value between 0 and 30 years. This is the expected value for the end of the simulation period 2041',
            defaultValue: 15,
            min: 0,
            max: 30,
            type: 'number'
        },
        "university_students_objective": {
            title: 'University education',
            label: 'Percentage of students starting university as a fraction of students completing "school"',
            help: 'The sum of people starting university and people starting vocational training must be equal to or less than 100. The remainder is counted as "unskilled workers"',
            defaultValue: 25,
            min: 15,
            max: 60,
            type: 'number'
        },
        "vt_fraction_objective": {
            title: 'Vocational training',
            label: 'Percentage of students starting vocational training as a fraction of students completing "school"',
            help: 'The sum of people starting university and people starting vocational training must be equal to or less than 100. The remainder is counted as "unskilled workers"',
            defaultValue: 70,
            min: 40,
            max: 85,
            type: 'number'
        },
        "farm_to_fork_effect_on_services": {
            title: 'Impact of Farm to Fork',
            label: 'The effect of Farm to Fork on the number of people employed in the agricultural services sector',
            xRange: [2022, 2041],
            yRange: [0, 5],
            defaultValue: [],
            help: 'Farm to fork is an EU strategy to strengthen European agriculture. Vidzeme has estimated that Farm to Fork could lead to new jobs in the agro-services sector. The realization of these jobs will rely on the effectiveness of the implementation of Farm to Fork in Lativa.  Using a scale between 0 and 5 you can express the effect of Farm to Fork strategy over time. 0 means none of the jobs are realized, 5 means all the jobs are realized.',
            type: 'graph'
        },
        "cap_ecoschemes": {
            title: 'Implementation of CAP Eco-schemes',
            label: 'The degree to which the CAP Eco-shemes mechanism is implemented in Latvia',
            xRange: [2022, 2041],
            yRange: [0, 5],
            defaultValue: [],
            help: 'CAP Eco-schemes aims to boost sustainable agricultural practices. This parameter reflects the implementation of CAP Eco-schemes in Latvia. Using a scale between 0 and 5 you can simulate variation over time. 0 means that the CAP Eco-schemes are not implemented, 5 means that the CAP Eco-schemes are fully implemented.',
            type: 'graph'
        },
        "population_covered_objective": {
            title: 'Broadband coverage',
            label: 'Percentage of population with access to broadband internet connectivity by 2041',
            min: 65,
            max: 100,
            defaultValue: 89,
            help: 'Enter the envisioned broadband coverage in 2041 as a percentage of the total  population',
            type: 'number'
        },
        "community_climate": {
            title: 'Community climate',
            label: 'Propensity of the community to tackle change and undertake common projects',
            xRange: [2022, 2041],
            yRange: [0, 5],
            defaultValue: [],
            help: 'Propensity of the community to tackle change and undertake common projects (0 poor; 5 optimal)',
            type: 'graph'
        },
        "time_to_build_effective_shared_knowledge": {
            title: 'Time to build shared knowledge and values',
            label: '',
            xRange: [0, 40],
            yRange: [0, 5],
            defaultValue: [],
            help: 'Time to build shared knowledge and values, as a function of the proportion of newcomers',
            type: 'graph'
        },
        "inst_support_evolution": {
            title: 'Investment into entrepreneurship and innovation',
            label: '',
            xRange: [2022, 2041],
            yRange: [0, 3000000],
            defaultValue: [],
            help: 'Yearly budget applied to support entrepreneurs and new initiatives in €',
            type: 'graph'
        }
    },
    "visualizations": {
        "service_jobs": "Service jobs",
        "Industrial_jobs": "Industrial jobs",
        "agriculture_jobs": "Agricultural jobs",
        "WORKING_AGE_POPULATION": "Working age population"
    }
}

function WizardView(props) {

    const { modelConfig, updateModelConfig, updateFilter, filter } = useContext(FilterContext);
    const { modelName } = useMatch('/:modelName')?.params;

    // Replace model config in database
    const saveModelConfig = useCallback(function _saveModelConfig(updatedModelConfig) {
        updateModelConfig(updatedModelConfig);
    }, [updateModelConfig]);

    useEffect(function _loadModelConfig() {
        if (!modelName) return console.debug("No model name specified", modelName);
        Api.get(modelName, "config")
            .then(function _handleResponse(res) {
                if (!res.data || !res.data.value) {
                    throw new Error("No model data in response");
                }
                // console.debug("Loaded model configuration");
                saveModelConfig(res.data.value);
            })
            .catch(function _handleError(err) {
                // console.debug("Error loading model config", err);
                saveModelConfig(_config);
            });
    }, [saveModelConfig, modelName]);

    const parameters = useMemo(function _generateParameters() {

        if (!modelConfig || !modelConfig.parameters) return [];

        return Object.keys(modelConfig.parameters)
            .map(function _forEachParameter(paramName) {
                let {
                    title,
                    label = '',
                    help = '',
                    xRange = [],
                    yRange = [],
                    defaultValue = undefined,
                    min = 0,
                    max = 0,
                    type = 'number'
                } = modelConfig.parameters[paramName];

                if (filter[paramName] && type === "number") {
                    console.log('Found param value', paramName, defaultValue)
                    defaultValue = filter[paramName];
                } else if (filter[paramName] &&
                    Array.isArray(filter[paramName].index) &&
                    Array.isArray(filter[paramName].data)
                ) {
                    defaultValue = filter[paramName].index.map((index, ctr) => {
                        return {
                            x: index,
                            y: filter[paramName].data[ctr]
                        }
                    });
                } else {
                    // console.debug(`Failed to find default value for ${paramName} in ${JSON.stringify(filter, null, 2)}`)
                    // console.debug(`No default value for ${paramName} in ${JSON.stringify(Object.keys(filter), null, 2)}`)
                    delete filter[paramName]
                }

                // Process each parameter type and return corresponding control
                switch (type) {
                    case "graph":
                        return (<WizardPage key={`auto-parameter-number-${paramName}`} title={title}>
                            <DrawLineChart
                                label={label}
                                parameter={paramName}
                                defaultData={defaultValue}
                                xRange={xRange}
                                yRange={yRange}
                                updateFilter={updateFilter} />
                            <HelpText>{help}</HelpText>
                        </WizardPage>);
                    case "number":
                    default:
                        return (<WizardPage key={`auto-parameter-chart-${paramName}`} title={title}>
                            <NumberInput
                                label={label}
                                parameter={paramName}
                                defaultValue={defaultValue}
                                min={min}
                                max={max}
                                updateFilter={updateFilter} />
                            <HelpText>{help}</HelpText>
                        </WizardPage>);
                }
            })
    }, [updateFilter, filter, modelConfig]);

    return (
        <Container fluid className="vh-100">
            {modelConfig && (
                <Row>
                    <Col xs={12} md={4} lg={3} className="filter-bar">
                        <Wizard title={modelConfig.title} children={parameters} />
                    </Col>
                    <Col xs={12} md={8} lg={9}>
                        <ModelView />
                    </Col>
                </Row>
            )}
        </Container >
    )
}

export default WizardView;
