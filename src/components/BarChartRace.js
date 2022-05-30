import './BarChartRace.scss';
import { useRef, useCallback, useMemo } from "react";
import { useD3 } from "../hooks/useD3";
import PropTypes from 'prop-types';
import * as d3 from 'd3';


export function BarChartRace(props) {

    let {
        title,
        description,
        caption,
        tickDuration,
        topN,
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
        calcMethod,
        valueLabelFormat,
        timeLabelFormat,
        run,
        colourScale,
        colourAccessor,
        labelFontSize,
        labelPadding,
        onComplete
    } = props;

    // Determine bar padding
    let barPadding = useMemo(() => {
        return (height - (margin.bottom + margin.top)) / (topN * 5)
    }, [height, margin, topN]);

    const _barWidth = useCallback((x) => {
        return (d) => {
            let w = x(d.value) - x(0) - 1;
            return w > 0 ? w : 1;
        }
    }, []);

    const _barHeight = useCallback((y) => {
        return (d) => {
            return y(1) - y(0) - barPadding;
        }
    }, [barPadding]);

    const _barX = useCallback((x) => {
        return (d) => {
            return x(0) + 1
        }
    }, [])

    const _barY = useCallback((y) => {
        return (d) => {
            return y(d.rank) + 5
        }
    }, []);

    const _translateXY = useCallback((x, y) => {
        return (d, i, n) => {

            let dx;
            if (n[i].getComputedTextLength() < (x(d.value) - labelPadding)) {
                dx = x(d.value) - labelPadding;
            } else {
                dx = x(d.value) + labelPadding;
            }
            let dy = y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1;
            return `translate(${dx} ${dy})`;
        }
    }, [labelPadding])

    const _textAnchor = useCallback((x) => {
        return (d, i, n) => {
            if (n[i].getComputedTextLength() < (x(d.value) - 8)) {
                return "end";
            } else {
                return "start";
            }
        }
    }, []);

    const _textSpan = useCallback((x) => {
        return (sel) => {

            let em = Math.ceil(labelFontSize * 1.2);

            // Add name
            sel.append("tspan")
                .attr("font-size", `${labelFontSize}px`)
                .attr("x", 0)
                .attr("dy", -em * 0.5)
                .attr("class", "name")
                .text(d => d.name);

            // Add value
            sel.append("tspan")
                .attr("font-size", `${labelFontSize}px`)
                .attr("x", 0)
                .attr("dy", em)
                .attr("class", "value")
                .text(d => valueLabelFormat(d.value));
        }

    }, [valueLabelFormat, labelFontSize])


    const _drawBars = useCallback((x, y, barPadding, transition = false) => {

        return (sel) => {
            let ne = sel.append('rect')
                .attr('class', d => `bar ${d.name.replace(/\s/g, '_')}`)
                .attr('x', _barX(x))
                .attr('y', _barY(y))
                .attr('width', _barWidth(x))
                .attr('height', _barHeight(y))
                .style('fill', d => d.colour);
            if (transition) {
                ne.transition()
                    .duration(tickDuration)
                    .ease(d3.easeLinear)
                    .attr('y', _barY(y));
            }
            // return sel;
        }
    }, [tickDuration, _barHeight, _barWidth, _barY, _barX])

    const _drawLabels = useCallback((x, y, className) => {
        return (sel) => {
            sel.append('text')
                .call(_textSpan(x))
                .attr('class', className)
                .attr("transform", _translateXY(x, y))
                .style("text-anchor", _textAnchor(x))
        }
    }, [_textSpan, _textAnchor, _translateXY]);

    const _halo = useCallback((text, strokeWidth) => {
        text.select(function () { return this.parentNode.insertBefore(this.cloneNode(true), this); })
            .style('fill', '#ffffff')
            .style('stroke', '#ffffff')
            .style('stroke-width', strokeWidth)
            .style('stroke-linejoin', 'round')
            .style('opacity', 1);
    }, []);

    const chart = useRef({
        currentTime: startTime
    });

    // Preprocess data
    let procData = useMemo(() => {

        let tmpData = data.map(d => {
            return {
                name: labelAccessor(d),
                value: isNaN(+valueAccessor(d)) ? 0 : +valueAccessor(d),
                lastValue: null, // Dummy value
                timeStep: +timeAccessor(d),
                colour: colourScale(colourAccessor(d)),
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

        if (calcMethod === BarChartRace.CALC_METHOD.PCT_DIFF) {
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

        if (calcMethod === BarChartRace.CALC_METHOD.ACCUMULATED) {
            d3.group(tmpData, d => d.name).forEach(
                nameSlice => {
                    let sortedSlice = nameSlice.sort((a, b) => a.timeStep - b.timeStep);
                    let accValue = d3.cumsum(sortedSlice, d=>d.value);
                    let accLastValue = d3.cumsum(sortedSlice, d=>d.lastValue);
                    for (var i1 = 1; i1 < sortedSlice.length; i1++) {
                        sortedSlice[i1].value = accValue[i1];
                        sortedSlice[i1].lastValue = accLastValue[i1];
                        sortedSlice[i1].keep = true;
                    }
                }
            );
            tmpData = tmpData.filter(d => d.keep === true);
            tmpData.forEach((d, i) => {
                delete d.keep;
            });
            console.log("accumulated", tmpData)
        }

        return tmpData;

    }, [data, labelAccessor, valueAccessor, timeAccessor, calcMethod, colourAccessor, colourScale]);

    const stopRace = useCallback(() => {
        onComplete()
        if (chart.current.ticker) {
            clearInterval(chart.current.ticker);
        }
    }, [onComplete])

    /**
     * Run the race
     */
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
                .slice(0, topN);

            timeSlice.forEach((d, i) => d.rank = i);

            const [xmin, xmax] = d3.extent(timeSlice, d => d.value);
            x.domain([xmin > 0 ? 0 : xmin, xmax < 0 ? 0 : xmax]);

            svg.select('.xAxis')
                .transition()
                .duration(tickDuration)
                .ease(d3.easeLinear)
                .call(xAxis);

            let bars = svg.selectAll('.bar').data(timeSlice, d => d.name);

            // Add new bars
            bars
                .enter()
                .call(_drawBars(x, y, barPadding, true))

            // Transition all bars
            bars
                .transition()
                .duration(tickDuration)
                .ease(d3.easeLinear)
                .attr('width', _barWidth(x))
                .attr('x', _barX(x))
                .attr('y', _barY(y));

            // Remove old bars
            bars
                .exit()
                .transition()
                .duration(tickDuration)
                .ease(d3.easeLinear)
                .attr('width', _barWidth(x))
                .attr('y', d => y(topN + 1) + 5)
                .remove();

            let labels = svg.selectAll('.label')
                .data(timeSlice, d => d.name);

            // Add new labels
            labels
                .enter()
                .append('text')
                .call(_textSpan(x))
                .attr('class', 'label')
                .attr("transform", _translateXY(x, y))
                .style('text-anchor', _textAnchor(x))
                .transition()
                .duration(tickDuration)
                .ease(d3.easeLinear)
                .attr("transform", _translateXY(x, y));

            // Transition labels
            labels
                .transition()
                .duration(tickDuration)
                .ease(d3.easeLinear)
                .attr("transform", _translateXY(x, y))
                .style("text-anchor", _textAnchor(x))
                .call(s => s.select("tspan.value")
                    .tween("text", (d) => {
                        let i = d3.interpolate(d.lastValue, d.value);
                        return function (t) {
                            this.textContent = valueLabelFormat(i(t));
                        };
                    })
                );

            // Remove low ranking labels
            labels
                .exit()
                .transition()
                .duration(tickDuration)
                .ease(d3.easeLinear)
                .attr("transform", d => {
                    let dx = x(d.value) - 8;
                    let dy = y(topN + 1) + 5;
                    return `translate(${dx} ${dy})`;
                })
                .remove();

            timeText.html(timeLabelFormat(currentTime));

            if (currentTime === endTime) {
                clearInterval(chart.current.ticker);
                onComplete()
            }

            currentTime = (+currentTime) + timeStep;

        }, tickDuration);
    }, [startTime, endTime, tickDuration, timeStep, topN, barPadding, procData, timeLabelFormat, _drawBars, _barX, _barY, _barWidth,
        _textAnchor, _textSpan, _translateXY, valueLabelFormat, onComplete]);

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
            .slice(0, topN);

        timeSlice.forEach((d, i) => d.rank = i);

        const [xmin, xmax] = d3.extent(timeSlice, d => d.value);

        let x = d3.scaleLinear()
            .domain([xmin > 0 ? 0 : xmin, xmax < 0 ? 0 : xmax])
            .range([margin.left, width - margin.right - 65]);

        let y = d3.scaleLinear()
            .domain([topN, 0])
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
            .call(_drawBars(x, y, barPadding))

        svg.selectAll('text.label')
            .data(timeSlice, d => d.name)
            .enter()
            .call(_drawLabels(x, y, 'label'))

        let timeText = svg.append('text')
            .attr('class', 'timeStep')
            .attr('x', width - margin.right)
            .attr('y', 0 + 50)
            .style('text-anchor', 'end')
            .html(timeLabelFormat(chart.current.currentTime))
            .call(_halo, 2);

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
            <div className="chart-container">
                <svg
                    ref={chartRef}
                    viewBox={`0 0 ${width} ${height}`}
                    xmlns="http://www.w3.org/2000/svg"
                >
                </svg>
            </div>
            <div className="action-buttons">
                <button onClick={() => runRace()}>Start</button>
                <button onClick={() => stopRace()}>Stop</button>
            </div>
        </div>
    )
}

BarChartRace.CALC_METHOD = {
    STANDARD: "standard",
    PCT_DIFF: "pct_diff",
    ACCUMULATED: "accumulated"
}

BarChartRace.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    description: PropTypes.string.isRequired,
    valueAccessor: PropTypes.func.isRequired,
    labelAccessor: PropTypes.func.isRequired,
    timeAccessor: PropTypes.func.isRequired,
    colourAccessor: PropTypes.func.isRequired,
    caption: PropTypes.string.isRequired,
    startTime: PropTypes.number.isRequired,
    endTime: PropTypes.number.isRequired,
    timeStep: PropTypes.number.isRequired,
    tickDuration: PropTypes.number,
    topN: PropTypes.number,
    height: PropTypes.number,
    width: PropTypes.number,
    calcMethod: PropTypes.string,
    margin: PropTypes.shape({
        top: PropTypes.number,
        right: PropTypes.number,
        bottom: PropTypes.number,
        left: PropTypes.number
    }),
    valueLabelFormat: PropTypes.func,
    timeLabelFormat: PropTypes.func,
    onComplete: PropTypes.func,
    run: PropTypes.bool,
    labelFontSize: PropTypes.number,
    labelPadding: PropTypes.number
}

BarChartRace.defaultProps = {
    tickDuration: 500,
    topN: 10,
    width: 640,
    height: 480,
    margin: {
        top: 80,
        right: 0,
        bottom: 5,
        left: 0
    },
    labelFontSize: 12,
    labelPadding: 5,
    calcMethod: BarChartRace.CALC_METHOD.STANDARD,
    valueLabelFormat: d3.format(',.2f'),
    timeLabelFormat: d3.format('d'),
    colourAccessor: () => null,
    colourScale: (colourKey) => d3.hsl(Math.random() * 360, 0.75, 0.75),
    onComplete: () => {
        console.debug("Not implemented");
    },
    run: false
}

export default BarChartRace;