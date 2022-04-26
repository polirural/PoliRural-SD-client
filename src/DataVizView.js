import { useEffect, useState } from "react";
import { BarChartRace } from "./components/BarChartRace";
import * as d3 from 'd3';
import { Col, Container, Row } from "react-bootstrap";

export function DataVizView() {

    const [data2, setData2] = useState(null);

    useEffect(() => {
        d3.csv('data.csv').then(res => setData2(res))
    }, []);


    if (!data2) return null;

    return (
        <Container fluid>
            <Row>
                <Col>
                    <BarChartRace
                        title="Proportion of Newcomers evolution"
                        description="Change in proportion of newcomers relative to population size over time"
                        caption="Source: Polirural SDT"
                        startTime={2020}
                        endTime={2040}
                        tickDuration={500}
                        timeStep={0.25}
                        valueAccessor={(d) => (d.proportion_NEWCOMERS) * 100}
                        labelAccessor={(d) => d.MODEL}
                        timeAccessor={(d) => d.TIME_STEP}
                        data={data2}
                        usePctGrowth
                    />
                </Col>
                <Col>
                    <BarChartRace
                        title="Proportion of Newcomers"
                        description="Newcomers as a percentage of total population"
                        caption="Source: Polirural SDT"
                        startTime={2020}
                        endTime={2040}
                        tickDuration={500}
                        timeStep={0.25}
                        valueAccessor={(d) => (d.proportion_NEWCOMERS) * 100}
                        labelAccessor={(d) => d.MODEL}
                        timeAccessor={(d) => d.TIME_STEP}
                        data={data2}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <BarChartRace
                        title="Proportion of tourists"
                        description="Tourists as a percentage of total rural population"
                        caption="Source: Polirural SDT"
                        startTime={2020}
                        endTime={2040}
                        tickDuration={500}
                        timeStep={0.25}
                        valueAccessor={(d) => (d.tourist_visitors / d.total_rural_population) * 100}
                        labelAccessor={(d) => d.MODEL}
                        timeAccessor={(d) => d.TIME_STEP}
                        data={data2}
                    />
                </Col>
            </Row>
        </Container>
    )
}


export default DataVizView;