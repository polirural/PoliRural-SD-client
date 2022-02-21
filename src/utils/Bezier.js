function factorial(n) {
    if (n < 0)
        return (-1); /*Wrong value*/
    if (n === 0)
        return (1);  /*Terminating condition*/
    else {
        return (n * factorial(n - 1));
    }
}

function nCr(n, r) {
    return (factorial(n) / (factorial(r) * factorial(n - r)));
}

export default function BezierCurve(points, numVertices = 1000) {
    let n = points.length;
    let curvepoints = [];
    for (let u = 0; u <= 1; u += (1 / numVertices)) {

        let p = { x: 0, y: 0 };

        for (let i = 0; i < n; i++) {
            let B = nCr(n - 1, i) * Math.pow((1 - u), (n - 1) - i) * Math.pow(u, i);
            let px = points[i].x * B;
            let py = points[i].y * B;

            p.x += px;
            p.y += py;

        }

        curvepoints.push(p);
    }

    return curvepoints;
}