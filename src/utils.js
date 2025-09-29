// checks if a timestamp string is RFC3339 and hour-aligned (minutes and seconds === 0)
export function isRFC3339Aligned(timestamp) {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:00:00Z$/.test(timestamp);
}

// parses an ISO timestamp string to a Date object
export function parseISOToDate(timestamp) {
    const d = new Date(timestamp);
    if (Number.isNaN(d.getTime())) throw new Error(`Invalid timestamp: ${timestamp}`);
    return d;
}

// returns a Date object representing the start of the hour for a given timestamp
export function startOfHour(ts) {
    const d = ts instanceof Date ? new Date(ts) : parseISOToDate(ts);
    d.setUTCMinutes(0, 0, 0);
    return d;
}

// returns a Date object representing the end of the hour for a given timestamp
export function endOfHour(ts) {
    const d = ts instanceof Date ? new Date(ts) : parseISOToDate(ts);
    d.setUTCMinutes(59, 59, 0);
    return d;
}

// formats a Date object as an ISO string with second precision (no milliseconds)
export function toSecondPrecisionISO(date) {
    return date.toISOString().replace(/\.000Z$/, 'Z');
}

// returns the ISO string for the start of the hour
export function startOfHourISO(ts) {
    return toSecondPrecisionISO(startOfHour(ts));
}

// returns the ISO string for the end of the hour
export function endOfHourISO(ts) {
    return toSecondPrecisionISO(endOfHour(ts));
}

// check near - equality for floating point numbers
export function almostEqual(a, b, epsilon = 1e-4) {
    return Math.abs(a - b) < epsilon;
}
