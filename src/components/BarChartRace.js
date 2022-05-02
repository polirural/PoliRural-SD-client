import './BarChartRace.scss';
import { useRef, useCallback, useMemo } from "react";
import { useD3 } from "../hooks/useD3";
import { Button, Row } from "react-bootstrap";
import PropTypes from 'prop-types';
import * as d3 from 'd3';

const halo = function (text, strokeWidth) {
    text.select(function () { return this.parentNode.insertBefore(this.cloneNode(true), this); })
        .style('fill', '#ffffff')
        .style('stroke', '#ffffff')
        .style('stroke-width', strokeWidth)
        .style('stroke-linejoin', 'round')
        .style('opacity', 1);
}

export function BarChartRace(props) {

    let {
        title,
        description,
        caption,
        tickDuration,
        top_n,
        height,
        width,
        margin,
        startTime,
        endTime,
        timeStep,
        valueAccessor,
        timeAccessor,
        labelAccessor,
        data,
        usePctGrowth,
        valueLabelFormat,
        timeLabelFormat,
        run
    } = props;

    const chart = useRef({
        currentTime: startTime
    });

    // Determine bar padding
    let barPadding = useMemo(() => (height - (margin.bottom + margin.top)) / (top_n * 5), [height, margin, top_n]);

    // Preprocess data
    let procData = useMemo(() => {

        let tmpData = data.map(d => {
            return {
                name: labelAccessor(d),
                value: isNaN(+valueAccessor(d)) ? 0 : +valueAccessor(d),
                lastValue: null, // Dummy value
                timeStep: +timeAccessor(d),
                colour: d3.hsl(Math.random() * 360, 0.75, 0.75),
                keep: false
            }
        });

        // Calculate previous value
        d3.group(tmpData, d => d.name).forEach(
            nameSlice => {
                let sortedSlice = nameSlice.sort((a, b) => a.timeStep - b.timeStep);
                for (var i0 = 0, i1 = 1; i1 < sortedSlice.length; i0++, i1++) {
                    sortedSlice[i1].lastValue = sortedSlice[i0].value;
                    sortedSlice[i1].keep = true;
                }
            }
        );

        tmpData = tmpData.filter(d => d.keep === true);
        tmpData.forEach(d => {
            d["keep"] = false;
        });

        if (usePctGrowth) {
            d3.group(tmpData, d => d.name).forEach(
                nameSlice => {
                    let sortedSlice = nameSlice.sort((a, b) => a.timeStep - b.timeStep);
                    for (var i0 = 1, i1 = 2; i1 < sortedSlice.length; i0++, i1++) {
                        let pctDiffLastValue = (sortedSlice[i0].value / sortedSlice[i0].lastValue) * 100;
                        sortedSlice[i1].diffLastValue = pctDiffLastValue;
                        let pctDiffValue = (sortedSlice[i1].value / sortedSlice[i1].lastValue) * 100;
                        sortedSlice[i1].diffValue = pctDiffValue;
                        sortedSlice[i1].keep = true;
                    }
                }
            );
            tmpData = tmpData.filter(d => d.keep === true);
            tmpData.forEach(d => {
                d.value = d.diffValue;
                d.lastValue = d.diffLastValue;
                delete d.keep;
                delete d.diffValue;
                delete d.diffLastValue;
            });
        }

        return tmpData;

    }, [data, labelAccessor, valueAccessor, timeAccessor, usePctGrowth]);

    const runRace = useCallback(() => {

        if (!chart.current) return;

        let { svg, x, y, xAxis, timeText, currentTime } = chart.current;

        if (chart.current.ticker) {
            clearInterval(chart.current.ticker);
        }

        currentTime = startTime;

        chart.current.ticker = setInterval(e => {

            let timeSlice = procData.filter(d => +d.timeStep === currentTime && !isNaN(d.value))
                .sort((a, b) => b.value - a.value)
                .slice(0, top_n);

            timeSlice.forEach((d, i) => d.rank = i);

            const [xmin, xmax] = d3.extent(timeSlice, d => d.value);
            x.domain([0, xmax]);

            svg.select('.xAxis')
                .transition()
                .duration(tickDuration)
                .ease(d3.easeLinear)
                .call(xAxis);

            let bars = svg.selectAll('.bar').data(timeSlice, d => d.name);

            bars
                .enter()
                .append('rect')
                .attr('class', d => `bar ${d.name.replace(/\s/g, '_')}`)
                .attr('x', x(0) + 1)
                .attr('width', d => x(d.value) - x(0) - 1)
                .attr('y', d => y(top_n + 1) + 5)
                .attr('height', y(1) - y(0) - barPadding)
                .style('fill', d => d.colour)
                .transition()
                .duration(tickDuration)
                .ease(d3.easeLinear)
                .attr('y', d => y(d.rank) + 5);

            bars
                .transition()
                .duration(tickDuration)
                .ease(d3.easeLinear)
                .attr('width', d => {
                    let w = x(d.value) - x(0) - 1;
                    return w > 0 ? w : 1;
                })
                .attr('y', d => y(d.rank) + 5);

            bars
                .exit()
                .transition()
                .duration(tickDuration)
                .ease(d3.easeLinear)
                .attr('width', d => x(d.value) - x(0) - 1)
                .attr('y', d => y(top_n + 1) + 5)
                .remove();

            let labels = svg.selectAll('.label')
                .data(timeSlice, d => d.name);

            labels
                .enter()
                .append('text')
                .attr('class', 'label')
                .attr('x', d => x(d.value) - 8)
                .attr('y', d => y(top_n + 1) + 5 + ((y(1) - y(0)) / 2))
                .style('text-anchor', 'end')
                .html(d => d.name)
                .transition()
                .duration(tickDuration)
                .ease(d3.easeLinear)
                .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1);


            labels
                .transition()
                .duration(tickDuration)
                .ease(d3.easeLinear)
                .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1)
                .attr('x', (d, i, n) => {
                    if (n[i].getComputedTextLength() < (x(d.value) - 8)) {
                        return x(d.value) - 8;
                    } else {
                        return x(d.value) + (valueLabelFormat(d.value).toString().length * 10);
                    }
                })
                .style("text-anchor", (d, i, n) => {
                    if (n[i].getComputedTextLength() < (x(d.value) - 8)) {
                        return "end";
                    } else {
                        return "start";
                    }
                })

            labels
                .exit()
                .transition()
                .duration(tickDuration)
                .ease(d3.easeLinear)
                .attr('x', d => x(d.value) - 8)
                .attr('y', d => y(top_n + 1) + 5)
                .remove();

            let valueLabels = svg.selectAll('.valueLabel').data(timeSlice, d => d.name);

            valueLabels
                .enter()
                .append('text')
                .attr('class', 'valueLabel')
                .attr('x', d => x(d.value) + 5)
                .attr('y', d => y(top_n + 1) + 5)
                .text(d => valueLabelFormat(d.lastValue))
                .transition()
                .duration(tickDuration)
                .ease(d3.easeLinear)
                .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1);

            valueLabels
                .transition()
                .duration(tickDuration)
                .ease(d3.easeLinear)
                .attr('x', d => x(d.value) + 5)
                .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1)
                .tween("text", function (d) {
                    let i = d3.interpolate(d.lastValue, d.value);
                    return function (t) {
                        this.textContent = valueLabelFormat(i(t));
                    };
                });

            valueLabels
                .exit()
                .transition()
                .duration(tickDuration)
                .ease(d3.easeLinear)
                .attr('x', d => x(d.value) + 5)
                .attr('y', d => y(top_n + 1) + 5)
                .remove();

            timeText.html(timeLabelFormat(currentTime));

            if (currentTime === endTime) clearInterval(chart.current.ticker);

            currentTime = (+currentTime) + timeStep;

        }, tickDuration);
    }, [startTime, endTime, tickDuration, timeStep, top_n, barPadding, procData, valueLabelFormat, timeLabelFormat]);

    const chartRef = useD3((svg) => {

        if (!procData) return;

        if (chart.current.ticker) {
            clearInterval(chart.current.ticker);
        }

        // Remove what is there on second load
        svg.selectAll("*").remove();

        // Add title
        svg.append('text')
            .attr('class', 'title')
            .attr('y', 24)
            .html(title);

        // Add description (sub-title)
        svg.append("text")
            .attr("class", "subTitle")
            .attr("y", 55)
            .html(description);

        // Add caption (below timestep indicator)
        svg.append('text')
            .attr('class', 'caption')
            .attr('x', width)
            .attr('y', height - 5)
            .style('text-anchor', 'end')
            .html(caption);

        // Calculate rank
        let timeSlice = procData.filter(d => d.timeStep === chart.current.currentTime && !isNaN(d.value))
            .sort((a, b) => b.value - a.value)
            .slice(0, top_n);

        timeSlice.forEach((d, i) => d.rank = i);

        const [xmin, xmax] = d3.extent(timeSlice, d => d.value);

        let x = d3.scaleLinear()
            .domain([0, xmax])
            .range([margin.left, width - margin.right - 65]);

        let y = d3.scaleLinear()
            .domain([top_n, 0])
            .range([height - margin.bottom, margin.top]);

        let xAxis = d3.axisTop()
            .scale(x)
            .ticks(width > 500 ? 5 : 2)
            .tickSize(-(height - margin.top - margin.bottom))
            .tickFormat(d => d3.format(',')(d));

        svg.append('g')
            .attr('class', 'axis xAxis')
            .attr('transform', `translate(0, ${margin.top})`)
            .call(xAxis)
            .selectAll('.tick line')
            .classed('origin', d => d === 0);

        svg.selectAll('rect.bar')
            .data(timeSlice, d => d.name)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', x(0) + 1)
            .attr('width', d => {
                let w = x(d.value) - x(0) - 1;
                return w > 0 ? w : 1;
            })
            .attr('y', d => y(d.rank) + 5)
            .attr('height', y(1) - y(0) - barPadding)
            .style('fill', d => d.colour);

        svg.selectAll('text.label')
            .data(timeSlice, d => d.name)
            .enter()
            .append('text')
            .attr('class', 'label')
            .text(d => d.name)
            .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1)
            .attr('x', (d, i, n) => {
                if (n[i].getComputedTextLength() < (x(d.value) - 8)) {
                    return x(d.value) - 8;
                } else {
                    return x(d.value) + (valueLabelFormat(d.value).toString().length * 10);
                }
            })
            .style("text-anchor", (d, i, n) => {
                if (n[i].getComputedTextLength() < (x(d.value) - 8)) {
                    return "end";
                } else {
                    return "start";
                }
            })

        svg.selectAll('text.valueLabel')
            .data(timeSlice, d => d.name)
            .enter()
            .append('text')
            .attr('class', 'valueLabel')
            .attr('x', d => x(d.value) + 5)
            .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1)
            .text(d => valueLabelFormat(d.lastValue));

        let timeText = svg.append('text')
            .attr('class', 'timeText')
            .attr('x', width - margin.right)
            .attr('y', height - 25)
            .style('text-anchor', 'end')
            .html(timeLabelFormat(chart.current.currentTime))
            .call(halo, 10);

        chart.current = {
            ...chart.current,
            svg: svg,
            timeText: timeText,
            xAxis: xAxis,
            x: x,
            y: y
        };

        if (run === true) {
            runRace();
        }

        return () => {
            if (chart.current.ticker) {
                clearInterval(chart.current.ticker);
            }
            svg.selectAll("*").remove();
        }

    }, [procData, barPadding, chart, valueLabelFormat, timeLabelFormat, run]);

    return (
        <div className="polirural-barchart-race p-3">
            <Row className="mb-3">
                <svg
                    ref={chartRef}
                    viewBox={`0 0 ${width} ${height}`}
                    xmlns="http://www.w3.org/2000/svg"
                >
                </svg>
            </Row>
            <Row className="mb-3">
                <Button onClick={() => runRace()}>Restart</Button>
            </Row>
        </div>
    )
}

BarChartRace.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    description: PropTypes.string.isRequired,
    valueAccessor: PropTypes.func.isRequired,
    labelAccessor: PropTypes.func.isRequired,
    timeAccessor: PropTypes.func.isRequired,
    caption: PropTypes.string.isRequired,
    startTime: PropTypes.number.isRequired,
    endTime: PropTypes.number.isRequired,
    timeStep: PropTypes.number.isRequired,
    tickDuration: PropTypes.number,
    top_n: PropTypes.number,
    height: PropTypes.number,
    width: PropTypes.number,
    usePctGrowth: PropTypes.bool,
    margin: PropTypes.shape({
        top: PropTypes.number,
        right: PropTypes.number,
        bottom: PropTypes.number,
        left: PropTypes.number
    }),
    valueLabelFormat: PropTypes.func,
    timeLabelFormat: PropTypes.func,
    onComplete: PropTypes.func,
    run: PropTypes.bool
}

BarChartRace.defaultProps = {
    tickDuration: 500,
    top_n: 12,
    width: 640,
    height: 480,
    margin: {
        top: 80,
        right: 0,
        bottom: 5,
        left: 0
    },
    usePctGrowth: false,
    valueLabelFormat: d3.format(',.2f'),
    timeLabelFormat: d3.format('d'),
    onComplete: () => {
        console.debug("Not implemented");
    },
    run: false
}

export default BarChartRace;