import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChartRace } from "./components/BarChartRace";
import * as d3 from 'd3';
import { Col, Container, Row, Form, Button } from "react-bootstrap";

const fields = {
    "rur_attr": "Rural attractiveness",
    "environmental_attr": "Environmental attractiveness",
    "economy_attr": "Economic attractiveness",
    "social_attr": "Social attractiveness",
    "anthropic_attr": "Anthropic attractiveness",
    "broadband_infrastructure_population_covered": "Population covered by broadband infrastructure",
    "workforce_specialization": "Workforce specialization",
    "farms": "Farms",
    "tourist_visitors": "Tourist visitors",
    "Natural_Capital": "Natural capital",
    "proportion_of_newcomers": "Proportion of newcomers",
    "shared_knowledge": "Shared knowledge",
    "social_innovation": "Social innovation",
    "proportion_INFANTS": "Proportion of infants",
    "proportion_ELDERLY_POPULATION": "Proportions of elderly population",
    "proportion_SCHOOL_AGE_POPULATION": "Proportion of school age population",
    "proportion_POST_SCHOOL_POPULATION": "Proportion of post school population",
    "proportion_WORKING_AGE_POPULATION": "Proportion of working age population",
    "proportion_NEWCOMERS": "Proportion of newcomers"
}

const twelweColours = [
    "#a6cee3",
    "#1f78b4",
    "#b2df8a",
    "#33a02c",
    "#fb9a99",
    "#e31a1c",
    "#fdbf6f",
    "#ff7f00",
    "#cab2d6",
    "#6a3d9a",
    "#ffff99",
    "#b15928"
];

export function DataVizView() {

    const [state, setState] = useState({
        scenarios: [],
        models: [],
        domains: [],
        rawChartData: [],
    });

    const [chartData, setChartData] = useState([])
    const [selectedScenario, setSelectedScenario] = useState()
    const [selectedModel, setSelectedModel] = useState()
    const [selectedDomain, setSelectedDomain] = useState()

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
        d3.csv('norm_data.csv').then(res => {

            setState(s => ({
                ...s,
                rawChartData: res,
                models: res.reduce((p, c) => {
                    if (p.indexOf(c.MODEL) === -1) {
                        p.push(c.MODEL);
                    }
                    return p;
                }, []),
                scenarios: res.reduce((p, c) => {
                    if (p.indexOf(c.scenario) === -1) {
                        p.push(c.scenario);
                    }
                    return p;
                }, []),
                domains: res.reduce((p, c) => {
                    if (p.indexOf(c.domain) === -1) {
                        p.push(c.domain);
                    }
                    return p;
                }, [])
            }))
        })
    }, []);

    useEffect(() => {
        let tmpChartData = state.rawChartData.slice(0);
        console.log(selectedDomain);
        if (selectedDomain) {
            tmpChartData = tmpChartData.filter(r=>r.domain === selectedDomain);
        }
        if (selectedModel) {
            tmpChartData = tmpChartData.filter(r=>r.MODEL === selectedModel);
        }
        if (selectedScenario) {
            tmpChartData = tmpChartData.filter(r=>r.scenario === selectedScenario);
        }
        setChartData(tmpChartData);
    }, [state.rawChartData, selectedDomain, selectedModel, selectedScenario])

    const colourScale = useMemo(() => {
        // console.log(chartData);
        if (!Array.isArray(chartData)) return;
        let u = chartData.reduce((p, c) => {
            if (p.indexOf(c.MODEL) === -1) {
                p.push(c.MODEL)
            }
            return p;
        }, []);
        return d3.scaleOrdinal(twelweColours).domain(u);
    }, [chartData])

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
                        <Form.Label>Select model</Form.Label>
                        <Form.Select onChange={(e) => {
                            let value = e.target.value;
                            setSelectedModel(value)
                        }}>
                            <option value={''}>All models</option>
                            {state.models.map((s, i) => (<option key={`model-${i}`} value={s}>{s}</option>))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Select domain</Form.Label>
                        <Form.Select onChange={(e) => {
                            let value = e.target.value;
                            setSelectedDomain(value)
                        }}>
                            <option value={''}>All domains</option>
                            {state.domains.map((s, i) => (<option key={`domain-${i}`} value={s}>{s}</option>))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Select scenario</Form.Label>
                        <Form.Select onChange={(e) => {
                            let value = e.target.value;
                            setSelectedScenario(value)
                        }}>
                            <option value={''}>All scenarios</option>
                            {state.scenarios.map((s, i) => (<option key={`scenario-${i}`} value={s}>{s}</option>))}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Select property to visualize</Form.Label>
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
                        description={`${chartField.label}  over time`}
                        caption="Source: Polirural SDT"
                        startTime={2020}
                        endTime={2040}
                        tickDuration={500}
                        timeStep={0.25}
                        valueAccessor={(d) => (d[chartField.value])}
                        labelAccessor={(d) => `${d.MODEL}: ${d.scenario}`}
                        colourAccessor={(d) => `${d.MODEL}: ${d.scenario}`}
                        // labelAccessor={(d) => d.MODEL}
                        // colourAccessor={(d) => d.MODEL}
                        timeAccessor={(d) => d.TIME_STEP}
                        valueLabelFormat={d3.format(",.3f")}
                        data={chartData}
                        usePctGrowth={false}
                        timeLabelFormat={timeLabelFormat}
                        run={doRun}
                        colourScale={colourScale}
                        onComplete={onRunCompleted}
                        top_n={4}
                    />
                </Col>
                <Col>
                    <BarChartRace
                        title={chartField2.label}
                        description={`${chartField2.label}  over time`}
                        caption="Source: Polirural SDT"
                        startTime={2020}
                        endTime={2040}
                        tickDuration={500}
                        timeStep={0.25}
                        valueAccessor={(d) => (d[chartField2.value])}
                        labelAccessor={(d) => `${d.MODEL}: ${d.scenario}`}
                        colourAccessor={(d) => `${d.MODEL}: ${d.scenario}`}
                        // labelAccessor={(d) => d.MODEL}
                        // colourAccessor={(d) => d.MODEL}
                        timeAccessor={(d) => d.TIME_STEP}
                        valueLabelFormat={d3.format(",.3f")}
                        data={chartData}
                        usePctGrowth={false}
                        timeLabelFormat={timeLabelFormat}
                        run={doRun}
                        colourScale={colourScale}
                        onComplete={onRunCompleted}
                        top_n={4}
                    />
                </Col>
            </Row>
            <Row className="mb-3 p-3">
                <Button onClick={runAll}>
                    Run both above
                </Button>
            </Row>
        </Container>
    )
}


export default DataVizView;