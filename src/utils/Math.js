export const customRound = (num, factor = 1) => {
    const quotient = num / factor;
    const res = Math.round(quotient) * factor;
    return res;
 };
