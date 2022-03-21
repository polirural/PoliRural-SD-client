export function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export function removeNulls(obj) {
    return Object.keys(clone(obj)).filter(k => obj[k] !== null && obj[k] !== undefined && !(Array.isArray(obj[k]) && obj[k].length === 0));
}

export function createObjectKeySort(objArr, key = "order", asc = true) {
    return (a, b) => {
        let a0 = objArr[a][key] || 0;
        let b0 = objArr[b][key] || 0;
        if (a0 > b0) return 1;
        if (b0 > a0) return -1;
        return 0;
    }
}
