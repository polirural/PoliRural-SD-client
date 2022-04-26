import * as d3 from 'd3';
import './LineChart.scss';
import { Button, Row } from 'react-bootstrap';
import React, { useCallback, useState } from 'react';
import { getSVGString, svgString2Image } from './../utils/SVGDownload';

import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';
import { useD3 } from './../hooks/useD3';
import { CHART_Y_STARTS_AT } from '../config/config';

function g(min, max) {
    let v = [];
    for (var i = min; i <= max; i++) {
        v.push(i);
    }
    return v;
}

function getData() {
    return g(1980, 2017).map(d => {
        return {
            x: d,
            y: Math.random() * 10000000
        }
    });
}

export function LineChart({ margin, width, height, xRange, yRange, data, baseline, title, origo, yTicks, xTicks }) {

    const [svgNode, setSvgNode] = useState(null);

    const drawLegend = useCallback((svg, width, height) => {

        let offset_top = 50;
        let offset_left = 100;
        let spacing = 15;
        let symbol_size = 5;

        // create a list of keys
        var keys = ["Current", "Comparison"]

        // Usually you have a color scale in your chart already
        var color = d3.scaleOrdinal()
            .domain(keys)
            .range(["#ff0000", "#0000ff"]);

        // Add one dot in the legend for each name.
        svg.selectAll(".legend-symbol").remove()
        svg.selectAll("g")
            .select(".legend-area")
            .data(keys)
            .enter()
            .append("circle")
            .attr("class", "legend-symbol")
            .attr("cx", (width - offset_left))
            .attr("cy", function (d, i) { return offset_top + (i * spacing) }) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", symbol_size)
            .style("fill", function (d) { return color(d) })

        // Add one dot in the legend for each name.
        svg.selectAll(".legend-label").remove()
        svg.selectAll("g")
            .select(".legend-area")
            .data(keys)
            .enter()
            .append("text")
            .attr("class", "legend-label")
            .attr("x", (width - (offset_left - (symbol_size * 2))))
            .attr("y", function (d, i) { return offset_top + (i * spacing) }) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function (d) { return color(d) })
            .text(function (d) { return d })
            .attr("text-anchor", "left")
            .attr("paint-order", "stroke")
            .attr("stroke", "white")
            .attr("stroke-width", "3px")
            .attr("font-size", "8pt")
            .attr("font-family", "Arial, sans-serif")
            .style("alignment-baseline", "middle")
    }, []);

    const chart = useD3((svg) => {

        width = parseFloat(svg.style("width"));
        var xRange1, yRange1;

        if (!xRange) {
            xRange = d3.extent(data.map(d => d.x));
            if (Array.isArray(baseline) && baseline.length > 0) {
                xRange1 = d3.extent(baseline.map(d => d.x));
                if (xRange1[0] < xRange[0]) xRange[0] = xRange1[0];
                if (xRange1[1] > xRange[1]) xRange[1] = xRange1[1];
            };
        }

        if (!yRange) {
            yRange = d3.extent(data.map(d => d.y));
            if (Array.isArray(baseline) && baseline.length > 0) {
                yRange1 = d3.extent(baseline.map(d => d.y));
                if (yRange1[0] < yRange[0]) yRange[0] = yRange1[0];
                if (yRange1[1] > yRange[1]) yRange[1] = yRange1[1];
            };
        }

        // Setup X-axis
        let [minX, maxX] = xRange;

        const scaleX = d3
            .scaleLinear()
            .domain([minX, maxX])
            .rangeRound([margin.left, width - margin.right]);

        const xAxis = (g) =>
            g.attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(scaleX).ticks(xTicks, "d"))
                .call(g => g.attr("pointer-events", "none"));

        svg.select("#x-axis")
            .call(xAxis);

        // Setup Y-axis
        let [minY, maxY] = yRange;
        // Correct if origo is set to zero
        minY = origo === CHART_Y_STARTS_AT.DATA ? minY : 0;

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

        const scaleY = d3
            .scaleLinear()
            .domain([minY, maxY])
            .rangeRound([height - margin.bottom, margin.top]);

        const yAxis = (g) =>
            g.attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(scaleY).ticks(yTicks, yTickNotation))
                .call((g) => g.attr("pointer-events", "none")
                    .append("text")
                    .attr("class", "noselect")
                    .attr("x", -margin.left)
                    .attr("y", 10)
                    .attr("text-anchor", "start")
                    .text(data.y1));

        svg.select("#y-axis")
            .call(yAxis);

        // Create permanent line function
        var line = d3.line()
            .x(function (d) { return scaleX(d.x); })
            .y(function (d) { return scaleY(d.y); });

        // Create and draw the permanent line

        if (baseline) {
            svg.selectAll(".baselineCurve").remove()
            svg
                .select(".plot-area")
                .append('path')
                .attr("d", line(baseline))
                .attr("class", "baselineCurve")
                .attr("fill", "none")
                .attr("stroke", "blue")
                .attr("stroke-width", "3px")
                .attr("pointer-events", "none");
        }

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

        drawLegend(svg, width, height);

        setSvgNode(svg.node());
    }, [margin, width, height, data, setSvgNode, drawLegend]);

    const downloadPNG = useCallback(() => {

        function save(dataBlob, filesize) {
            saveAs(dataBlob, `${encodeURIComponent(title)}'-chart.png'`); // FileSaver.js function
        }
        let svgString = getSVGString(svgNode)
        svgString2Image(svgString, 2 * width, 2 * height, 'png', save); // passes Blob and filesize String to the callback

    }, [width, height, svgNode, title]);

    return (
        // <div className="mx-auto" width={width} height={height} >
        <div className="polirural-line-chart m-3">
            <h4>{title}</h4>
            <div className="mx-auto" >
                <svg
                    ref={chart}
                    width={"100%"}
                    height={height}
                >
                    <g id="x-axis" className="axis" />
                    <g id="y-axis" className="axis" />
                    <g id="plot-area" className="plot-area" />
                    <g id="legend-area" className="legend-area" />
                </svg>
            </div>
            <Row className="mx-3">
                <Button size="sm" onClick={downloadPNG}>Download</Button>
            </Row>
        </div>
    );
}

LineChart.propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    xRange: PropTypes.arrayOf(PropTypes.number),
    yRange: PropTypes.arrayOf(PropTypes.number),
    margin: PropTypes.object,
    title: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number
    })).isRequired,
    baseline: PropTypes.arrayOf(PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number
    })),
    origo: PropTypes.number,
    xTicks: PropTypes.number,
    yTicks: PropTypes.number
}

LineChart.defaultProps = {
    margin: { top: 15, right: 25, bottom: 55, left: 55 },
    width: 320,
    height: 240,
    data: getData(),
    baseline: null,
    title: "Chart title",
    origo: CHART_Y_STARTS_AT.DATA,
    xTicks: 5,
    yTicks: 5
}

export default LineChart;

