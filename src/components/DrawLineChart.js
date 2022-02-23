import './DrawLineChart.scss';

import * as d3 from 'd3';

import Curve, { curveTypes } from './../utils/Curve';
import { Dropdown, Form, Row } from 'react-bootstrap';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import FilterContext from '../context/FilterContext';
import PropTypes from 'prop-types';
import { useD3 } from './../hooks/useD3';

export function DrawLineChart({ margin, width, height, xRange, yRange, parameter, label, numberFormat, defaultData }) {

    const { updateFilter } = useContext(FilterContext);

    const [data, setData] = useState([]);

    useEffect(function _setDefaultData() {
        setData(defaultData);
    }, [defaultData])

    const buildSeries = useCallback((coords) => {
        var series = {
            index: [],
            data: []
        }
        coords.forEach(a => {
            if (a.x0 && a.y0) {
                series.index.push(a.x0);
                series.data.push(+numberFormat(a.y0));
            } else {
                series.index.push(a.x);
                series.data.push(+numberFormat(a.y));
            }
        })
        return series;
    }, [numberFormat]);

    const genCurve = useCallback((curveType) => {
        curveType = curveType !== undefined ? curveType : curveTypes.flat50;
        const d = Curve(curveType, xRange, yRange);
        console.log(d);
        setData(d);
        updateFilter(parameter, buildSeries(d))
    }, [xRange, yRange, parameter, updateFilter, buildSeries])

    var chart = useD3((svg) => {

        // Get dynamic witdht of chart
        width = +svg.style("width").replace("px", "");

        // Setup X-axis
        const [minX, maxX] = xRange;

        const scaleX = d3
            .scaleLinear()
            .domain([minX, maxX]).nice()
            .rangeRound([margin.left, width - margin.right]);

        const xAxis = (g) =>
            g.attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(scaleX).ticks(null, ""))
                .call(g => g.attr("pointer-events", "none"));

        svg.select(".x-axis").call(xAxis);

        // Setup Y-axis
        const [minY, maxY] = yRange;

        const scaleY = d3
            .scaleLinear()
            .domain([minY, maxY]).nice()
            .range([height - margin.bottom, margin.top]);

        const yAxis = (g) =>
            g.attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(scaleY).ticks(null, "s"))
                .call((g) => g.attr("pointer-events", "none")
                    .append("text")
                    .attr("class", "noselect")
                    .attr("x", -margin.left)
                    .attr("y", 10)
                    .attr("text-anchor", "start")
                    .text(data.y1));

        svg.select(".y-axis").call(yAxis);

        // Set up line plotting functions

        // Create temp line function
        var tempLine = d3.line()
            .x(function (d) { return d.x; })
            .y(function (d) { return d.y; });

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
        var line = d3.line()
            .x(function (d) { return scaleX(d.x); })
            .y(function (d) { return scaleY(d.y); });

        // Create and draw the permanent line
        svg.selectAll(".curve").remove()

        svg
            .select(".plot-area")
            .append('path')
            .attr("d", line(data))
            .attr("class", "curve")
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", "3px")
            .attr("pointer-events", "none");


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

        const onDrag = (event) => {
            event.preventDefault()
            return null;
        }

        const onMove = (e) => {
            if (state) {
                const [minX, maxX] = scaleX.domain();
                const [minY, maxY] = scaleY.domain();
                let x0 = Math.round(scaleX.invert(e.layerX));
                let y0 = scaleY.invert(e.layerY);
                if ((coords.length === 0 || coords[coords.length - 1].x0 < x0)
                    && (x0 >= minX && x0 <= maxX)
                    && (y0 >= minY && y0 <= maxY)
                ) {
                    coords.push({
                        x: e.layerX,
                        y: e.layerY,
                        x0,
                        y0
                    })
                }
                clearTimeout(_onMoveTimeout);
                // svg
                //     .select(".temp-line")
                //     .attr("d", tempLine(coords));
                _onMoveTimeout = setTimeout(() => {
                    drawTempLine(coords)
                }, 1)
            }
        }


        const onDown = (event) => {
            coords.length = 0;
            state = true;
        }

        let _onUpOutTimeout = null;

        const onUpOut = (event) => {
            clearTimeout(_onUpOutTimeout);
            _onUpOutTimeout = setTimeout(function _onUpOut() {
                if (state) {
                    state = false;
                    drawTempLine([]);                    
                    setData(coords);
                    updateFilter(parameter, buildSeries(coords))
                    // console.log(coords, buildSeries(coords));
                }
            }, 50)
        }

        // Create a background rectangle that captures all mouse movement
        svg
            .select(".plot-area")
            .append("rect")
            .attr("pointer-events", "all")
            .attr("x", margin.left)
            .attr("y", margin.top)
            .attr("width", width - (margin.left + margin.right))
            .attr("height", height - (margin.top + margin.bottom))
            .attr("fill", "white")
            .lower()
            .on("mousemove", onMove)
            .on("mousedown", onDown)
            .on("mouseup", onUpOut)
            .on("mouseleave", onUpOut)

        svg.on('mousemove', onDrag);
        // svg.addEventListener('mousemove', onDrag);

    }, [margin, width, height, data]);

    return (
        <div className="sdt-draw-line-chart mx-auto" width={width} height={height} >
            {label && (<Form.Label>{label}</Form.Label>)}
            <svg
                ref={chart}
                height="100%"
                width="100%"
            >
                <g className="plot-area" />
                <g className="x-axis" />
                <g className="y-axis" />
            </svg>
            <Row className="text-right">
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
            </Row>
        </div>
    );
}

DrawLineChart.propTypes = {
    height: PropTypes.number.isRequired,
    xRange: PropTypes.arrayOf(PropTypes.number).isRequired,
    yRange: PropTypes.arrayOf(PropTypes.number).isRequired,
    updateFilter: PropTypes.func.isRequired,
    parameter: PropTypes.string.isRequired,
    margin: PropTypes.object,
    width: PropTypes.number.isRequired,
    label: PropTypes.string,
    numberFormat: PropTypes.func,
    defaultData: PropTypes.arrayOf(PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number
    }))
}

DrawLineChart.defaultProps = {
    margin: { top: 15, right: 15, bottom: 35, left: 35 },
    width: 320,
    height: 160,
    label: undefined,
    numberFormat: d3.format(".1f"),
    defaultData: []
}

export default DrawLineChart;

