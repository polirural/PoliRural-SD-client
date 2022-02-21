import BezierCurve from './Bezier';

export const curveTypes = {
    "flat0": "Flat (0%)",
    "flat25": "Flat (25%)",
    "flat50": "Flat (50%)",
    "flat75": "Flat (75%)",
    "flat100": "Flat (100%)",
    "linearGrowth": "Linear growth",
    "linearDecline": "Linear decline",
    "polynomicGrowth": "Polynomic growth",
    "polynomicDecline": "Polynomic decline",
    "exponentialGrowth": "Exponential growth",
    "exponentialDecline": "Exponential decline"
}

export default function Curve(curveType, xRange, yRange) {
    curveType = curveType !== undefined ? curveType : curveTypes.flat50;
    const [xMin, xMax] = xRange;
    const [yMin, yMax] = yRange;
    var d = [];
    let step;
    let crv;
    switch (curveType) {
        case curveTypes.flat0:
            for (let i = xMin; i <= xMax; i += 1) {
                d.push({ x: i, y: yMin })
            }
            break;
        case curveTypes.flat25:
            for (let i = xMin; i <= xMax; i += 1) {
                d.push({ x: i, y: (yMin + (((yMax - yMin) / 4) * 1)) })
            }
            break;
        case curveTypes.flat50:
            for (let i = xMin; i <= xMax; i += 1) {
                d.push({ x: i, y: (yMin + (((yMax - yMin) / 4) * 2)) })
            }
            break;
        case curveTypes.flat75:
            for (let i = xMin; i <= xMax; i += 1) {
                d.push({ x: i, y: (yMin + (((yMax - yMin) / 4) * 3)) })
            }
            break;
        case curveTypes.flat100:
            for (let i = xMin; i <= xMax; i += 1) {
                d.push({ x: i, y: yMax })
            }
            break;
        case curveTypes.linearGrowth:
            step = (yMax - yMin) / (xMax - xMin)
            for (let i = xMin, i0 = 0; i <= xMax; i += 1, i0 += step) {
                d.push({ x: i, y: i0 })
            }
            break;
        case curveTypes.linearDecline:
            step = (yMax - yMin) / (xMax - xMin);
            for (let x0 = xMin, y0 = yMax; x0 <= xMax; x0 += 1, y0 -= step) {
                d.push({ x: x0, y: y0 })
            }
            break;
        case curveTypes.exponentialGrowth:
            for (let x0 = xMax, y0 = yMax; x0 >= xMin; x0 -= 1, y0 = y0 / 2) {
                d.unshift({ x: x0, y: y0 })
            }
            break;
        case curveTypes.exponentialDecline:
            for (let x0 = xMin, y0 = yMax; x0 <= xMax; x0 += 1, y0 = y0 / 2) {
                d.push({ x: x0, y: y0 })
            }
            break;
        case curveTypes.polynomicGrowth:
            crv = BezierCurve([
                { x: 0, y: 0 },
                { x: 0.45, y: 0.01 },
                { x: 0.55, y: 0.99 },
                { x: 1, y: 1 },
            ], (xMax - xMin));
            for (let x0 = xMin, i = 0; x0 < xMax; x0 += 1, i++) {
                d.push({
                    x: x0,
                    y: yMin + (crv[i].y * (yMax - yMin))
                });
            }
            break;
        case curveTypes.polynomicDecline:
            crv = BezierCurve([
                { x: 1, y: 1 },
                { x: 0.55, y: 0.99 },
                { x: 0.45, y: 0.01 },
                { x: 0, y: 0 }
            ], (xMax - xMin));
            for (let x0 = xMin, i = 0; x0 < xMax; x0 += 1, i++) {
                d.push({
                    x: x0,
                    y: yMin + (crv[i].y * (yMax - yMin))
                });
            }
            break;
        default:
            console.error('Unhandled', curveType);
    }
    return d;
}