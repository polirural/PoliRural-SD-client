import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChartRace } from "./components/BarChartRace";
import * as d3 from 'd3';
import { Col, Container, Row, Form, Button } from "react-bootstrap";

const fields = {
    'farms': 'Number of farms',
    'Natural_Capital': 'Natural capital',
    'NEWCOMERS': 'Number of newcomers',
    'broadband_infrastructure_population_covered': 'Percentage of population covered by broadband',
    'proportion_of_newcomers': 'Proportion of newcomers',
    'shared_knowledge': 'Shared knowledge',
    'social_innovation': 'Social innovation',
    'tourist_visitors': 'Proportion of tourists relative to population size',
    'workforce_specialization': 'Workforce specialization university/vocational',
    'INFANTS': 'Size of infant population',
    'ELDERLY_POPULATION': 'Size of elderly population',
    'SCHOOL_AGE_POPULATION': 'Size of school age population',
    'POST_SCHOOL_POPULATION': 'Size of post-school population',
    'WORKING_AGE_POPULATION': 'Size of working age population',
    'WORKING_AGE_RURAL_POPULATION': 'Working age rural population',
    'total_rural_population': 'Total rural population',
    'proportion_INFANTS': 'Proportion of infants',
    'proportion_ELDERLY_POPULATION': 'Proportion of elderly population',
    'proportion_SCHOOL_AGE_POPULATION': 'Proportion of school age population',
    'proportion_POST_SCHOOL_POPULATION': 'Proportion of post school population',
    'proportion_WORKING_AGE_POPULATION': 'Proportion of working age population',
    'proportion_NEWCOMERS': 'Proportion of newcomers'
}

export function DataVizView() {

    const [chartData, setChartData] = useState(null);
    const [chartField, setChartField] = useState({
        value: Object.keys(fields)[0],
        label: fields[Object.keys(fields)[0]]
    });
    const [chartField2, setChartField2] = useState({
        value: Object.keys(fields)[0],
        label: fields[Object.keys(fields)[0]]
    });

    const [doRun, setDoRun] = useState(false);

    useEffect(() => {
        d3.csv('data.csv').then(res => setChartData(res))
    }, []);

    const options = useMemo(() => {
        return Object.keys(fields).map((value, i) => {
            let label = fields[value];
            return (<option key={`option-${value}`} value={value}>{label}</option>)
        })
    }, [])

    const runAll = useCallback(() => {
        setDoRun(true);
    }, [])

    const onRunCompleted = useCallback(() => {
        setDoRun(false);
    }, [])

    const timeLabelFormat = useCallback((d) => {
        let r = d % 1;
        let val = d - r;
        let q = r / 0.25;
        return `${val} Q${q + 1}`;
    }, []);    

    if (!chartData) return null;
    return (
        <Container fluid>
            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Select field to visualize</Form.Label>
                        <Form.Select onChange={(e) => {
                            let label = e.target.selectedOptions[0].label;
                            let value = e.target.value;
                            setDoRun(false);
                            setChartField({
                                value,
                                label
                            });
                        }}>
                            {options}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Select field to visualize</Form.Label>
                        <Form.Select onChange={(e) => {
                            let label = e.target.selectedOptions[0].label;
                            let value = e.target.value;
                            setDoRun(false);
                            setChartField2({
                                value,
                                label
                            });
                        }}>
                            {options}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <BarChartRace
                        title={chartField.label}
                        description={`Change in ${chartField.label}  over time`}
                        caption="Source: Polirural SDT"
                        startTime={2020}
                        endTime={2040}
                        tickDuration={500}
                        timeStep={0.25}
                        valueAccessor={(d) => (d[chartField.value])}
                        labelAccessor={(d) => d.MODEL}
                        timeAccessor={(d) => d.TIME_STEP}
                        data={chartData}
                        usePctGrowth={false}
                        timeLabelFormat={timeLabelFormat}
                        run={doRun}
                        onComplete={onRunCompleted}
                    />
                </Col>
                <Col>
                    <BarChartRace
                        title={chartField2.label}
                        description={`Change in ${chartField2.label}  over time`}
                        caption="Source: Polirural SDT"
                        startTime={2020}
                        endTime={2040}
                        tickDuration={500}
                        timeStep={0.25}
                        valueAccessor={(d) => (d[chartField2.value])}
                        labelAccessor={(d) => d.MODEL}
                        timeAccessor={(d) => d.TIME_STEP}
                        data={chartData}
                        usePctGrowth={false}
                        timeLabelFormat={timeLabelFormat}
                        run={doRun}
                        onComplete={onRunCompleted}
                    />
                </Col>
            </Row>
            <Row className="mb-3 p-3">
                <Button onClick={runAll}>
                    Run all
                </Button>
            </Row>
        </Container>
    )
}


export default DataVizView;