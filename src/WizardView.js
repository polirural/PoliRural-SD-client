import { Col, Container, Row } from 'react-bootstrap';
import { useContext, useState } from 'react';

import { DrawLineChart } from './components/DrawLineChart';
import FilterContext from './context/FilterContext';
import FilterProvider from './context/FilterProvider';
import ModelView from './ModelView';
import NumberInput from './components/NumberInput';
import Wizard from './components/Wizard';
import WizardPage from "./components/WizardPage";

// Sample configuration
// eslint-disable-next-line
const vidzemeConfig = {
    "wsEndpoint": 'https://hub.polirural.eu/sdt/model/vidzeme',
    "baselineScenario": {
        "param1": 1,
        "param2": 3
    },
    "visualizations": {
        "ELDERLY_POPULATION": "Elderly population",
        "UNIVERSITY_STUDENTS": "University students",
        "SCHOOL_AGE_POPULATION": "School age population",
        "GRADUATED_PROFESSIONALS": "Graduated professionals",
        "INFANTS": "Infants",
        "elderly_move_rural": "Elderly people moving to rural areas annually    "
    }
}

function WizardView(props) {

    const ctx = useContext(FilterContext);
    const [config] = useState(vidzemeConfig);

    return (
        <FilterProvider>
            <Container fluid>
                <Row>
                    <Col xs={12} md={4} lg={3}>
                        <Wizard title="Vidzeme rural development model">
                            <WizardPage key="wp1" title="Average life time of an industrial business">
                                <NumberInput label="Life time in years"
                                    parameter="average_life_of_an_industrial_business"
                                    defaultValue={20}
                                    min={0}
                                    max={30}
                                    updateFilter={ctx.updateFilter} />
                                <p>Choose a value between 0 and 30 years. This is the expected value for the end of the simulation period 2041</p>
                            </WizardPage>
                            <WizardPage key="wp2" title="Average life time of a service business">
                                <NumberInput label="Life time in years"
                                    parameter="average_life_of_a_service_business"
                                    defaultValue={15}
                                    min={0}
                                    max={15}
                                    updateFilter={ctx.updateFilter} />
                                <p>Choose a value between 0 and 15 years. This is the expected value for the end of the simulation period 2041</p>
                            </WizardPage>
                            <WizardPage key="wp3" title="University education">
                                <NumberInput label="Percentage of students starting university as a fraction of students completing &quot;school&quot;"
                                    parameter="university_students_objective"
                                    defaultValue={25}
                                    min={15}
                                    max={60}
                                    updateFilter={ctx.updateFilter} />
                                <p>The sum of people starting university and people starting vocational training must be equal to or less than 100. The remainder is counted as 'unskilled workers'</p>
                            </WizardPage>
                            <WizardPage key="wp4"  title="Vocational training">
                                <NumberInput label="Percentage of students starting vocational training as a fraction of students completing &quot;school&quot;"
                                    parameter="vt_fraction_objective"
                                    defaultValue={70}
                                    min={40}
                                    max={85}
                                    updateFilter={ctx.updateFilter} />
                                <p>The sum of people starting university and people starting vocational training must be equal to or less than 100. The remainder is counted as 'unskilled workers'</p>
                            </WizardPage>
                            <WizardPage key="wp5" title="Impact of Farm to Fork">
                                <DrawLineChart
                                    label="The effect of Farm to Fork on the number of people employed in the agricultural services sector"
                                    xRange={[2022, 2041]}
                                    yRange={[0, 5]}
                                    parameter="farm_to_fork_effect_on_services"
                                    updateFilter={ctx.updateFilter} />
                                <p>Farm to fork is an EU strategy to strengthen European agriculture. Vidzeme has estimated that Farm to Fork could lead to new jobs in the agro-services sector. The realization of these jobs will rely on the effectiveness of the implementation of Farm to Fork in Lativa.  Using a scale between 0 and 5 you can express the effect of Farm to Fork strategy over time. 0 means none of the jobs are realized, 5 means all the jobs are realized.</p>
                            </WizardPage>
                            <WizardPage key="wp6" title="Implementation of CAP Eco-schemes">
                                <DrawLineChart
                                    label="The degree to which the CAP Eco-shemes mechanism is implemented in Latvia"
                                    xRange={[2022, 2041]}
                                    yRange={[0, 5]}
                                    parameter="cap_ecoschemes"
                                    updateFilter={ctx.updateFilter} />
                                <p>CAP Eco-schemes aims to boost sustainable agricultural practices. This parameter reflects the implementation of CAP Eco-schemes in Latvia. Using a scale between 0 and 5 you can simulate variation over time. 0 means that the CAP Eco-schemes are not implemented, 5 means that the CAP Eco-schemes are fully implemented.</p>
                            </WizardPage>
                            <WizardPage key="wp7" title="Broadband coverage">
                                <NumberInput label="Percentage of population with access to broadband internet connectivity by 2041"
                                    parameter="population_covered_objective"
                                    defaultValue={89}
                                    min={65}
                                    max={100}
                                    updateFilter={ctx.updateFilter} />
                                <p>Enter the envisioned broadband coverage in 2041 as a percentage of the total  population</p>
                            </WizardPage>
                            <WizardPage key="wp8"  title="Community climate">
                                <DrawLineChart
                                    label="Propensity of the community to tackle change and undertake common projects"
                                    xRange={[2022, 2041]}
                                    yRange={[0, 5]}
                                    parameter="community_climate"
                                    updateFilter={ctx.updateFilter} />
                                <p>Propensity of the community to tackle change and undertake common projects (0 poor; 5 optimal)</p>
                            </WizardPage>
                            <WizardPage key="wp9" title="Time to build shared knowledge and values">
                                <DrawLineChart
                                    xRange={[0, 40]}
                                    yRange={[0, 5]}
                                    parameter="time_to_build_effective_shared_knowledge"
                                    updateFilter={ctx.updateFilter} />
                                <p>Time to build shared knowledge and values, as a function of the proportion of newcomers</p>
                            </WizardPage>
                            <WizardPage key="wp10" title="Investment into entrepreneurship and innovation">
                                <DrawLineChart
                                    xRange={[2022, 2041]}
                                    yRange={[0,3000000]}
                                    parameter="inst_support_evolution"
                                    updateFilter={ctx.updateFilter} />
                                <p>Yearly budget applied to support entrepreneurs and new initiatives in €</p>
                            </WizardPage>
                        </Wizard>
                    </Col>
                    <Col xs={12} md={8} lg={9}>
                        <ModelView modelConfig={config} />
                    </Col>
                </Row>
            </Container >
        </FilterProvider>
    )
}

export default WizardView;
