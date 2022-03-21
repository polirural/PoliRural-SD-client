import * as d3 from 'd3';

import { Button, Row } from 'react-bootstrap';
import React, { useCallback, useState } from 'react';
import { getSVGString, svgString2Image } from './../utils/SVGDownload';

import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';
import { useD3 } from './../hooks/useD3';

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

export function LineChart({ margin, width, height, xRange, yRange, data, baseline, title }) {

    const [svgNode, setSvgNode] = useState(null);

    var chart = useD3((svg) => {

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
        const [minX, maxX] = xRange;

        const scaleX = d3
            .scaleLinear()
            .domain([minX, maxX])
            .rangeRound([margin.left, width - margin.right]);

        const xAxis = (g) =>
            g.attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(scaleX).ticks(5, ""))
                .call(g => g.attr("pointer-events", "none"));

        svg.select(".x-axis").call(xAxis);

        // Setup Y-axis
        const [minY, maxY] = yRange;

        const scaleY = d3
            .scaleLinear()
            .domain([minY, maxY])
            .rangeRound([height - margin.bottom, margin.top]);

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

        setSvgNode(svg.node());
    }, [margin, width, height, data, setSvgNode]);

    const downloadPNG = useCallback(() => {

        function save( dataBlob, filesize ){
            saveAs( dataBlob, 'D3 vis exported to PNG.png' ); // FileSaver.js function
        }        
        let svgString = getSVGString(svgNode)
        svgString2Image( svgString, 2*width, 2*height, 'png', save ); // passes Blob and filesize String to the callback
    
    }, [width, height, svgNode]);

    return (
        // <div className="mx-auto" width={width} height={height} >
        <div className="m-3">
            <h4>{title}</h4>
            <div className="mx-auto" >
                <svg
                    ref={chart}
                    width="100%"
                    height={height}            >
                    <g className="plot-area" />
                    <g className="x-axis" />
                    <g className="y-axis" />
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
    }))
}

LineChart.defaultProps = {
    margin: { top: 15, right: 15, bottom: 35, left: 35 },
    width: 320,
    height: 240,
    data: getData(),
    baseline: null,
    title: "Chart title"
}

export default LineChart;

