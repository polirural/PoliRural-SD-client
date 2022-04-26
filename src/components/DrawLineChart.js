import './DrawLineChart.scss';

import * as d3 from 'd3';

import Curve, { curveTypes } from './../utils/Curve';
import { customRound } from './../utils/Math';
import { Dropdown, Form, Row, Col, Button } from 'react-bootstrap';
import React, { useCallback, useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { useD3 } from './../hooks/useD3';

// Build filter value series from chart
function buildFilterSeries(chartData, numberFormat) {
    if (chartData === null) return null;
    var series = {
        index: [],
        data: []
    }
    chartData.forEach(a => {
        series.index.push(a.x);
        series.data.push(+numberFormat(a.y));
    })
    return series;
};

// Build chart series from filter value
function buildChartSeries(filterData, numberFormat) {
    var series = filterData.data.map((dataValue, idx) => {
        return {
            x: filterData.index[idx],
            y: +numberFormat(dataValue)
        }
    })
    return series;
};

export function DrawLineChart({ margin, width, height, xRange, yRange, name, label, numberFormat, value, onChange, xTicks, yTicks }) {

    const [data, setData] = useState(null);

    // Wheneve the chart value changes, parse the value and set the data property
    useEffect(function _onValueChange() {
        let tmpVal = null;
        if (value && Array.isArray(value.index) && value.index.length > 0 && value.index.length === value.data.length) {
            tmpVal = buildChartSeries(value, numberFormat);
        }
        setData(tmpVal);
    }, [value, numberFormat])

    // Whenever the chart updates its data, propagate to the onChange method supplied from parent as a control event
    const onDiagramChange = useCallback(function _onDiagramChange(chartData) {
        setData(chartData);
        let tmpFilterData = undefined;
        if (chartData && Array.isArray(chartData) && chartData.length > 0) {
            tmpFilterData = {
                target: {
                    name,
                    value: buildFilterSeries(chartData, numberFormat)
                }
            };
            onChange(tmpFilterData);
        } else {
            onChange({
                target: {
                    name,
                    value: tmpFilterData
                }
            });
        }
    }, [onChange, name, numberFormat]);

    // Generate a curve based on a curveType keyword, invoked by drop-down
    const genCurve = useCallback((curveType) => {
        curveType = curveType !== undefined ? curveType : curveTypes.flat50;
        const curveData = Curve(curveType, xRange, yRange);
        onDiagramChange(curveData);
    }, [xRange, yRange, onDiagramChange])

    // Main chart drawing function
    var chart = useD3((svg) => {

        // Get dynamic width of chart
        width = +svg.style("width").replace("px", "");

        // Setup X-axis
        // Datermine X-axis range
        const [minX, maxX] = xRange;

        // Create X-axis scale
        const scaleX = d3
            .scaleLinear()
            .domain([minX, maxX]).nice()
            .rangeRound([margin.left, width - margin.right]);

        // Create X-axis line
        const xAxis = (g) =>
            g.attr("transform", `translate(0, ${height - margin.bottom})`)
                .call(d3.axisBottom(scaleX).ticks(5, "d"))
                .call(g => g.attr("pointer-events", "none"));

        // Add X-axis to chart
        svg.select(".x-axis").call(xAxis);

        // Setup Y-axis
        // Determine Y-axis range
        const [minY, maxY] = yRange;

        var ySpan = maxY - minY;

        let yTickNotation = "d";
        if ((ySpan / yTicks) <= 0.01) {
            yTickNotation = ".3f";
        } else if (ySpan / yTicks < 0.1) {
            yTickNotation= ".2f";
        } else if (ySpan / yTicks < 1) {
            yTickNotation= ".1f";
        } else if (ySpan / yTicks < 1000) {
            yTickNotation= "d";
        } else {            
            yTickNotation= "s";
        }

        // Create Y-axis scale
        const scaleY = d3
            .scaleLinear()
            .domain([minY, maxY]).nice()
            .range([height - margin.bottom, margin.top]);

        // Create Y-axis line
        const yAxis = (g) =>
            g.attr("transform", `translate(${margin.left}, 0)`)
                .call(d3.axisLeft(scaleY).ticks(5, yTickNotation))
                .call((g) => g.attr("pointer-events", "none")
                    .append("text")
                    .attr("class", "noselect")
                    .attr("x", -margin.left)
                    .attr("y", 10)
                    .attr("text-anchor", "start")
                    .text(data && data.y1 ? data.y1 : 0));

        // Add Y-axis to chart
        svg.select(".y-axis").call(yAxis);

        // Set up line plotting functions

        // Create temp line function
        var tempLine = d3.line()
            .x(function (d) { return scaleX(d.x); })
            .y(function (d) { return scaleY(d.y); });

        // Create graph element to hold temp line
        svg
            .select(".plot-area")
            .append('path')
            .attr("class", "temp-line")
            .attr("fill", "none")
            .attr("stroke", "green")
            .attr("stroke-width", "3px")
            .attr("pointer-events", "none");

        // Create permanent line function
        var permLine = d3.line()
            .x(function (d) { return scaleX(d.x); })
            .y(function (d) { return scaleY(d.y); });

        // Create and draw the permanent line
        svg.selectAll(".perm-line").remove()
        if (data) {
            svg
                .select(".plot-area")
                .append('path')
                .attr("d", permLine(data))
                .attr("class", "perm-line")
                .attr("fill", "none")
                .attr("stroke", "red")
                .attr("stroke-width", "3px")
                .attr("pointer-events", "none");
        }

        // Setup variables to track mouse interaction
        var state = false
        var coords = [];

        var _onMoveTimeout = null;

        const drawTempLine = (coords) => {
            if (!Array.isArray(coords)) return;
            svg
                .select(".temp-line")
                .attr("d", tempLine(coords));
        }

        // Setup event handlers, wire to chart

        // When key is pressed
        const onDown = (event) => {
            coords.length = 0;
            state = true;
        }

        const onMove = (e) => {
            if (state) {
                const [minX, maxX] = scaleX.domain();
                const [minY, maxY] = scaleY.domain();
                let x0 = customRound(scaleX.invert(e.layerX), 0.25);
                let y0 = scaleY.invert(e.layerY);
                if ((coords.length === 0 || coords[coords.length - 1].x < x0)
                    && (x0 >= minX && x0 <= maxX)
                    && (y0 >= minY && y0 <= maxY)
                ) {
                    coords.push({
                        x: x0,
                        y: y0
                    })
                }
                clearTimeout(_onMoveTimeout);
                _onMoveTimeout = setTimeout(() => {
                    drawTempLine(coords)
                }, 1)
            }
        }

        // When line is finished
        let _onUpOutTimeout = null;
        const onUpOut = (event) => {
            clearTimeout(_onUpOutTimeout);
            _onUpOutTimeout = setTimeout(function _onUpOut() {
                if (state) {
                    state = false;
                    drawTempLine([]);
                    if (coords[0].x > xRange[0]) {
                        coords.unshift({
                            x: xRange[0],
                            y: coords[0].y
                        })
                    }
                    if (coords[coords.length - 1].x < xRange[1]) {
                        coords.push({
                            x: xRange[1],
                            y: coords[coords.length - 1].y
                        })
                    }
                    onDiagramChange(coords);
                }
            }, 50)
        }

        // Create a background rectangle that captures all mouse movement and wire events
        svg
            .select(".plot-area")
            .append("rect")
            .attr("pointer-events", "all")
            .attr("x", margin.left)
            .attr("y", margin.top)
            .attr("width", width - (margin.left + margin.right))
            .attr("height", height - (margin.top + margin.bottom))
            .attr("fill", "#f0f0f0")
            .lower()
            .on("mousemove", onMove)
            .on("mousedown", onDown)
            .on("mouseup", onUpOut)
            .on("mouseleave", onUpOut);


        // Prevent dragging chart when drawing line
        const onDrag = (event) => {
            event.preventDefault()
            return null;
        }
        svg.on('mousemove', onDrag);

    }, [margin, width, height, data]);

    return (
        <div className="sdt-draw-line-chart mx-auto">
            {label && (<Form.Label>{label}</Form.Label>)}
            <div className="sdt-draw-line-chart-container" style={{height: height}}>
                <svg
                    ref={chart}
                >
                    <g className="plot-area" />
                    <g className="x-axis" />
                    <g className="y-axis" />
                </svg>
            </div>
            <Row className="text-right">
                <Col>
                    <Dropdown>
                        <Dropdown.Toggle size="sm" variant="link">
                            Use template
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {Object.keys(curveTypes)
                                .map(function _forEachCurveType(key, idx) {
                                    return (
                                        <Dropdown.Item
                                            key={`dd-item-${idx}`}
                                            onClick={function _onSelectCurveType() {
                                                return genCurve(curveTypes[key])
                                            }}>
                                            {curveTypes[key]}
                                        </Dropdown.Item>
                                    )
                                })
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col>
                    <div className="d-grid">
                        <Button size="sm" variant="link" onClick={() => {
                            onDiagramChange(null);
                        }}>Clear</Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

DrawLineChart.propTypes = {
    height: PropTypes.number.isRequired,
    xRange: PropTypes.arrayOf(PropTypes.number).isRequired,
    yRange: PropTypes.arrayOf(PropTypes.number).isRequired,
    name: PropTypes.string.isRequired,
    margin: PropTypes.object,
    width: PropTypes.number.isRequired,
    label: PropTypes.string,
    numberFormat: PropTypes.func,
    value: PropTypes.shape({
        index: PropTypes.arrayOf(PropTypes.number),
        data: PropTypes.arrayOf(PropTypes.number)
    }),
    onChange: PropTypes.func,
    xTicks: PropTypes.number,
    yTicks: PropTypes.number
}

DrawLineChart.defaultProps = {
    margin: { top: 15, right: 25, bottom: 55, left: 55 },
    width: 360,
    height: 240,
    label: undefined,
    numberFormat: d3.format(".3f"),
    value: {
        index: [],
        data: []
    },
    xTicks: 5,
    yTicks: 5,
    onChange: (event) => console.log("Not implemented", event)
}

export default DrawLineChart;

