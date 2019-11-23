export const flatMap = (f, arr) => arr.reduce((x, y) => [...x, ...f(y)], []);
